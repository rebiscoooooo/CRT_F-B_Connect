<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\Assessment;
use App\Models\AssessmentQuestion;
use App\Models\Resource;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class SmartAssessmentService
{
    /**
     * Generate or regenerate a 10-question smart assessment quiz for a resource.
     */
    public function generateForResource(
        Resource $resource,
        int $passingPercentage = 75,
        ?int $timeLimitMinutes = 15,
        bool $isPublished = true,
        ?int $createdBy = null
    ): Assessment {
        $questionsData = $this->tryGenerateWithGemini($resource);

        if (empty($questionsData) || count($questionsData) < 10) {
            $questionsData = $this->generateCurriculumQuestions($resource);
        }

        // Ensure exactly 10 questions
        $questionsData = array_slice($questionsData, 0, 10);

        $assessmentTitle = "{$resource->title} — Knowledge Check Assessment";
        $assessmentDescription = "Comprehensive 10-question assessment evaluating competencies, standard procedures, and key takeaways for \"{$resource->title}\".";

        $assessment = Assessment::updateOrCreate(
            ['resource_id' => $resource->id],
            [
                'title' => $assessmentTitle,
                'description' => $assessmentDescription,
                'passing_percentage' => $passingPercentage,
                'time_limit_minutes' => $timeLimitMinutes,
                'is_published' => $isPublished,
                'created_by' => $createdBy ?? $resource->uploaded_by ?? 1,
            ]
        );

        // Delete existing questions to replace with fresh set
        $assessment->questions()->delete();

        foreach ($questionsData as $index => $q) {
            AssessmentQuestion::create([
                'assessment_id' => $assessment->id,
                'question_text' => $q['question_text'],
                'question_type' => 'multiple_choice',
                'options' => $q['options'],
                'correct_answer' => $q['correct_answer'],
                'points' => (int) ($q['points'] ?? 1),
                'order' => $index + 1,
                'explanation' => $q['explanation'] ?? null,
            ]);
        }

        ActivityLog::record(
            'assessment_smart_generated',
            "Smart Assessment Engine generated a 10-question quiz for \"{$resource->title}\" ({$resource->resource_type})",
            $createdBy ?? $resource->uploaded_by,
            Assessment::class,
            $assessment->id
        );

        return $assessment->load('questions');
    }

    /**
     * Try generating 10 questions using Google Gemini API with multimodal document grounding.
     *
     * @return array<int, array{question_text: string, options: array, correct_answer: string, points: int, explanation: string}>|null
     */
    protected function tryGenerateWithGemini(Resource $resource): ?array
    {
        $apiKey = config('services.gemini.api_key') ?: env('GEMINI_API_KEY');
        if (empty($apiKey)) {
            return null;
        }

        // Prioritized list of models: ultra-fast flash-lite models followed by previews and standard flash
        $configuredModel = config('services.gemini.model');
        $candidateModels = array_values(array_unique(array_filter([
            $configuredModel,
            'gemini-3.5-flash-lite',
            'gemini-3.1-flash-lite',
            'gemini-3-flash-preview',
            'gemini-3.8-flash',
        ])));

        // Build multimodal payload parts
        $parts = [];

        // Check if an attached PDF or illustration exists and attach as inline_data
        if (! empty($resource->file_path)) {
            try {
                $storage = Storage::disk('public');
                if ($storage->exists($resource->file_path)) {
                    $fullPath = $storage->path($resource->file_path);
                    $fileSize = file_exists($fullPath) ? filesize($fullPath) : 0;
                    $ext = strtolower(pathinfo($resource->file_path, PATHINFO_EXTENSION));

                    // For files <= 18MB, send directly to Gemini via inline_data
                    if ($fileSize > 0 && $fileSize <= 18 * 1024 * 1024) {
                        if ($ext === 'pdf' || $resource->resource_type === 'pdf' || str_contains((string) $resource->mime_type, 'pdf')) {
                            $parts[] = [
                                'inline_data' => [
                                    'mime_type' => 'application/pdf',
                                    'data' => base64_encode(file_get_contents($fullPath)),
                                ],
                            ];
                        } elseif (in_array($ext, ['png', 'jpg', 'jpeg', 'webp']) || $resource->resource_type === 'illustration') {
                            $mime = match ($ext) {
                                'png' => 'image/png',
                                'webp' => 'image/webp',
                                default => 'image/jpeg',
                            };
                            $parts[] = [
                                'inline_data' => [
                                    'mime_type' => $mime,
                                    'data' => base64_encode(file_get_contents($fullPath)),
                                ],
                            ];
                        }
                    }
                }
            } catch (\Throwable $e) {
                Log::warning("Could not attach file payload for resource {$resource->id}: {$e->getMessage()}");
            }
        }

        // Extract textual context from resource
        $contextText = $this->extractResourceText($resource);

        $prompt = <<<EOT
You are an expert academic curriculum evaluator.
STRICT FACTUAL GROUNDING MANDATE (ZERO HALLUCINATION):
1. You MUST generate questions and answer keys that are 100% strictly derived from, explicitly mentioned in, and verified by this lesson material (the attached document, image diagram, or lesson notes below).
2. DO NOT invent, extrapolate, assume, or introduce outside facts, concepts, or procedures that are not explicitly present in the provided lesson.
3. Every question must test specific facts, rules, procedures, definitions, equipment, steps, or code presented in this exact lesson.
4. Generate EXACTLY 10 distinct multiple-choice questions.
5. Each question must provide 4 realistic options (keys: "A", "B", "C", "D"), with only ONE correct answer verified directly by the lesson.
6. Distribute the correct answers across A, B, C, and D.
7. Provide a clear pedagogical explanation (1-2 sentences) directly citing or referencing where this is stated in the lesson material.
8. Return ONLY a valid JSON array of 10 objects conforming to this schema:
[
  {
    "question_text": "Question statement here?",
    "options": [
      {"key": "A", "text": "Option A"},
      {"key": "B", "text": "Option B"},
      {"key": "C", "text": "Option C"},
      {"key": "D", "text": "Option D"}
    ],
    "correct_answer": "B",
    "points": 1,
    "explanation": "Citation/explanation why B is correct based on the lesson..."
  }
]

RESOURCE DETAILS:
- Title: {$resource->title}
- Material Type: {$resource->resource_type}
- Category: {$resource->category?->name}
- Curriculum Folder: {$resource->folder?->name}
- External Link/Video Reference: {$resource->external_url}
- Description & Objectives: {$resource->description}
- Additional Lesson Content / Text Notes:
{$contextText}
EOT;

        $parts[] = ['text' => $prompt];

        foreach ($candidateModels as $model) {
            try {
                $endpoint = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}";

                $response = Http::timeout(45)->post($endpoint, [
                    'contents' => [
                        [
                            'parts' => $parts,
                        ],
                    ],
                    'generationConfig' => [
                        'response_mime_type' => 'application/json',
                        'temperature' => 0.2,
                    ],
                ]);

                if ($response->successful()) {
                    $body = $response->json();
                    $rawText = $body['candidates'][0]['content']['parts'][0]['text'] ?? null;

                    if ($rawText) {
                        $decoded = json_decode($rawText, true);

                        // If wrapped in an object like {"questions": [...]}
                        if (isset($decoded['questions']) && is_array($decoded['questions'])) {
                            $decoded = $decoded['questions'];
                        }

                        if (is_array($decoded) && count($decoded) >= 10) {
                            return $this->validateAndFormatQuestions($decoded);
                        }
                    }
                } else {
                    Log::warning("Gemini model {$model} returned status {$response->status()}: ".substr($response->body(), 0, 150));
                }
            } catch (\Throwable $e) {
                Log::warning("Gemini model {$model} threw exception: {$e->getMessage()}");
            }
        }

        return null;
    }

    /**
     * Extract representative text content from the resource.
     */
    protected function extractResourceText(Resource $resource): string
    {
        $parts = [];

        if (! empty($resource->content)) {
            $parts[] = Str::limit(strip_tags($resource->content), 3000);
        }

        if (! empty($resource->description)) {
            $parts[] = 'Description: '.$resource->description;
        }

        return implode("\n\n", $parts);
    }

    /**
     * Validate and sanitize questions from AI output.
     */
    protected function validateAndFormatQuestions(array $rawQuestions): array
    {
        $formatted = [];

        foreach ($rawQuestions as $item) {
            if (empty($item['question_text']) || empty($item['options']) || empty($item['correct_answer'])) {
                continue;
            }

            $options = [];
            foreach ($item['options'] as $opt) {
                if (isset($opt['key']) && isset($opt['text'])) {
                    $options[] = [
                        'key' => strtoupper(trim((string) $opt['key'])),
                        'text' => trim((string) $opt['text']),
                    ];
                }
            }

            if (count($options) < 4) {
                continue;
            }

            $correctKey = strtoupper(trim((string) $item['correct_answer']));

            $formatted[] = [
                'question_text' => trim((string) $item['question_text']),
                'options' => array_slice($options, 0, 4),
                'correct_answer' => in_array($correctKey, ['A', 'B', 'C', 'D']) ? $correctKey : 'A',
                'points' => (int) ($item['points'] ?? 1),
                'explanation' => trim((string) ($item['explanation'] ?? 'This is the standard procedure in food and beverage operations.')),
            ];

            if (count($formatted) === 10) {
                break;
            }
        }

        return $formatted;
    }

    /**
     * Intelligent domain curriculum question generator.
     * Generates 10 high-caliber, practical questions specifically customized to the
     * Food & Beverage Services NC II curriculum and the lesson's title/domain.
     *
     * @return array<int, array>
     */
    public function generateCurriculumQuestions(Resource $resource): array
    {
        $text = strtolower($resource->title.' '.$resource->description.' '.($resource->category?->name ?? ''));
        $title = $resource->title;

        // Detect primary topics based on keywords
        $isBeverage = Str::contains($text, ['wine', 'bar', 'cocktail', 'beverage', 'drink', 'coffee', 'barista', 'liquor', 'beer', 'spirit', 'mixology']);
        $isTableSetting = Str::contains($text, ['table', 'setting', 'napkin', 'fold', 'cover', 'flatware', 'cutlery', 'linens', 'mise-en-place', 'silverware']);
        $isServiceStyle = Str::contains($text, ['service', 'french', 'russian', 'american', 'english', 'gueridon', 'buffet', 'banquet', 'tray', 'carrying']);
        $isFoodSafety = Str::contains($text, ['safety', 'sanitation', 'hygiene', 'haccp', 'clean', 'hazard', 'temperature', 'danger zone', 'cross-contamination']);
        $isOrderTaking = Str::contains($text, ['order', 'guest', 'taking', 'pos', 'billing', 'upselling', 'complaint', 'reception', 'customer', 'check']);
        $isCulinary = Str::contains($text, ['culinary', 'kitchen', 'cooking', 'knife', 'recipe', 'plating', 'prep', 'sauce', 'chef']);

        $pool = [];

        if ($isBeverage) {
            $pool = $this->getBeverageQuestionPool($title);
        } elseif ($isTableSetting) {
            $pool = $this->getTableSettingQuestionPool($title);
        } elseif ($isFoodSafety) {
            $pool = $this->getFoodSafetyQuestionPool($title);
        } elseif ($isOrderTaking) {
            $pool = $this->getOrderTakingQuestionPool($title);
        } elseif ($isCulinary) {
            $pool = $this->getCulinaryQuestionPool($title);
        } elseif ($isServiceStyle) {
            $pool = $this->getServiceStyleQuestionPool($title);
        }

        // If domain pool has fewer than 10 questions, mix in general F&B standard questions
        $generalPool = $this->getGeneralHospitalityPool($title);
        foreach ($generalPool as $genQ) {
            if (count($pool) >= 10) {
                break;
            }
            $pool[] = $genQ;
        }

        // Slice to exactly 10 questions
        return array_slice($pool, 0, 10);
    }

    /**
     * Beverage & Bar Operations Question Pool (10 questions)
     */
    protected function getBeverageQuestionPool(string $title): array
    {
        return [
            [
                'question_text' => "In accordance with standard bar service procedures shown in \"{$title}\", which side of the seated guest should wine and beverages be presented and poured?",
                'options' => [
                    ['key' => 'A', 'text' => 'From the guest\'s left side using the left hand'],
                    ['key' => 'B', 'text' => 'From the guest\'s right side using the right hand with the bottle label facing the guest'],
                    ['key' => 'C', 'text' => 'From directly behind the guest placed on the center of the table'],
                    ['key' => 'D', 'text' => 'From whichever side is most convenient regardless of posture'],
                ],
                'correct_answer' => 'B',
                'points' => 1,
                'explanation' => 'Beverage and wine service must always be performed from the guest\'s right side with the right hand, ensuring the label is clearly visible to the guest.',
            ],
            [
                'question_text' => 'When opening a bottle of still wine at the table, what is the correct technique for cutting the foil capsule?',
                'options' => [
                    ['key' => 'A', 'text' => 'Tear off the entire foil wrapper by hand without using a foil cutter'],
                    ['key' => 'B', 'text' => 'Cut the foil just below the second lip/ring of the bottle neck to prevent drips contacting the foil'],
                    ['key' => 'C', 'text' => 'Cut the foil directly across the very top rim of the bottle'],
                    ['key' => 'D', 'text' => 'Puncture through the foil directly with the corkscrew worm'],
                ],
                'correct_answer' => 'B',
                'points' => 1,
                'explanation' => 'Cutting below the second ring of the neck prevents wine drips from contacting the foil, which can alter the flavor or contaminate the pour.',
            ],
            [
                'question_text' => 'What is the primary purpose of presenting the cork to the host after uncorking a wine bottle?',
                'options' => [
                    ['key' => 'A', 'text' => 'To let the host keep the cork as a decorative souvenir'],
                    ['key' => 'B', 'text' => 'To allow the host to inspect the cork for moisture, integrity, and confirm the producer branding'],
                    ['key' => 'C', 'text' => 'To test if the wine is alcoholic'],
                    ['key' => 'D', 'text' => 'To prepare the cork to be reinserted immediately after tasting'],
                ],
                'correct_answer' => 'B',
                'points' => 1,
                'explanation' => 'Presenting the cork enables the host to verify that the cork is properly moist, intact, and matches the bottle label branding without cork taint.',
            ],
            [
                'question_text' => 'What is the correct standard glassware holding technique for wine and cocktail service?',
                'options' => [
                    ['key' => 'A', 'text' => 'Holding the glass bowl firmly with both palms to warm the beverage'],
                    ['key' => 'B', 'text' => 'Holding the glass by the rim using thumbs and fingers'],
                    ['key' => 'C', 'text' => 'Holding the glass by the stem or base to avoid finger smudges and temperature transfer'],
                    ['key' => 'D', 'text' => 'Holding the glass inside the opening with fingers'],
                ],
                'correct_answer' => 'C',
                'points' => 1,
                'explanation' => 'Stemware must always be held by the stem or foot/base to avoid heating the chilled wine with hand warmth and to keep the bowl free of smudges.',
            ],
            [
                'question_text' => "What is the recommended pouring portion for a standard red or white wine glass during table dining relevant to \"{$title}\"?",
                'options' => [
                    ['key' => 'A', 'text' => 'Filled to the absolute brim to maximize service'],
                    ['key' => 'B', 'text' => 'One-third to one-half full (approx. 4 to 5 ounces) to allow aeration and aroma appreciation'],
                    ['key' => 'C', 'text' => 'Exactly three-quarters full'],
                    ['key' => 'D', 'text' => 'Only a quarter ounce'],
                ],
                'correct_answer' => 'B',
                'points' => 1,
                'explanation' => 'Filling wine glasses 1/3 to 1/2 full permits swirling and captures aromatic bouquets within the glass bowl without spilling.',
            ],
            [
                'question_text' => 'Which cocktail preparation technique is required for drinks containing spirits, citrus juices, cream, or syrup?',
                'options' => [
                    ['key' => 'A', 'text' => 'Building and serving unmixed'],
                    ['key' => 'B', 'text' => 'Stirring gently with a bar spoon for 5 seconds'],
                    ['key' => 'C', 'text' => 'Vigorous shaking in a cocktail shaker with ice to properly emulsify and chill'],
                    ['key' => 'D', 'text' => 'Heating in a microwave oven'],
                ],
                'correct_answer' => 'C',
                'points' => 1,
                'explanation' => 'Drinks with citrus juice, cream, eggs, or thick syrups require vigorous shaking with ice to chill, aerate, and thoroughly emulsify the ingredients.',
            ],
            [
                'question_text' => 'What is the role of a service cloth (liteau) during professional beverage service?',
                'options' => [
                    ['key' => 'A', 'text' => 'To cover the guest\'s eyes during tasting'],
                    ['key' => 'B', 'text' => 'To wipe the bottle neck after each pour and prevent droplets onto the tablecloth'],
                    ['key' => 'C', 'text' => 'To replace dirty dinner napkins on the table'],
                    ['key' => 'D', 'text' => 'To clean the floor around the station'],
                ],
                'correct_answer' => 'B',
                'points' => 1,
                'explanation' => 'The waiter\'s service cloth (liteau) is held in the non-pouring hand to immediately catch and wipe any droplets from the bottle lip after pouring.',
            ],
            [
                'question_text' => 'When serving multiple guests at a table, what is the standard order of pouring wine?',
                'options' => [
                    ['key' => 'A', 'text' => 'Pour the host a full glass first, then clockwise to all male guests'],
                    ['key' => 'B', 'text' => 'Pour a 1-ounce tasting sample for the host; once approved, serve ladies first, gentlemen next, and the host last'],
                    ['key' => 'C', 'text' => 'Pour for whichever guest asks loudest first'],
                    ['key' => 'D', 'text' => 'Pour simultaneously into all glasses on a tray'],
                ],
                'correct_answer' => 'B',
                'points' => 1,
                'explanation' => 'Standard protocol dictates pouring a tasting sample for the host. After approval, ladies are served first, then gentlemen, concluding with the host.',
            ],
            [
                'question_text' => 'What is the ideal serving temperature range for crisp dry white wines and champagnes?',
                'options' => [
                    ['key' => 'A', 'text' => '18°C to 22°C (warm room temperature)'],
                    ['key' => 'B', 'text' => '6°C to 10°C (well-chilled)'],
                    ['key' => 'C', 'text' => 'Below freezing (-5°C) with ice crystals'],
                    ['key' => 'D', 'text' => 'Room temperature (25°C)'],
                ],
                'correct_answer' => 'B',
                'points' => 1,
                'explanation' => 'Sparkling and crisp white wines are best served chilled between 6°C and 10°C to preserve their freshness, crisp acidity, and effervescence.',
            ],
            [
                'question_text' => "What sanitizing practice must be strictly observed when preparing bar garnishes discussed in \"{$title}\"?",
                'options' => [
                    ['key' => 'A', 'text' => 'Handling cut citrus wheels and olives with bare unwashed fingers'],
                    ['key' => 'B', 'text' => 'Using bar tongs or clean food-grade gloves and preparing garnishes on sanitized cutting boards'],
                    ['key' => 'C', 'text' => 'Soaking garnishes in soapy dishwater before serving'],
                    ['key' => 'D', 'text' => 'Reusing garnishes left behind on returning cocktail glasses'],
                ],
                'correct_answer' => 'B',
                'points' => 1,
                'explanation' => 'Ready-to-eat garnishes must always be handled with sanitized tongs or clean food-grade gloves to prevent biological contamination.',
            ],
        ];
    }

    /**
     * Table Setting & Napkin Folding Question Pool (10 questions)
     */
    protected function getTableSettingQuestionPool(string $title): array
    {
        return [
            [
                'question_text' => "In standard table cover mise-en-place featured in \"{$title}\", what is the required distance between flatware and the table edge?",
                'options' => [
                    ['key' => 'A', 'text' => '1 inch (approx. 2.5 cm) from the edge of the table'],
                    ['key' => 'B', 'text' => '5 inches from the edge of the table'],
                    ['key' => 'C', 'text' => 'Flushed completely over the rim'],
                    ['key' => 'D', 'text' => '3 inches away'],
                ],
                'correct_answer' => 'A',
                'points' => 1,
                'explanation' => 'International dining standards require cutlery handles to be aligned exactly 1 inch (or thumb\'s length, 2.5 cm) from the table edge.',
            ],
            [
                'question_text' => 'Where should dinner forks be positioned relative to the showplate / cover?',
                'options' => [
                    ['key' => 'A', 'text' => 'To the right side of the plate, with tines facing down'],
                    ['key' => 'B', 'text' => 'To the left side of the plate, with tines facing upward'],
                    ['key' => 'C', 'text' => 'Horizontally above the plate with handles to the left'],
                    ['key' => 'D', 'text' => 'Directly on top of the napkin inside the water goblet'],
                ],
                'correct_answer' => 'B',
                'points' => 1,
                'explanation' => 'Forks are placed on the left side of the dinner plate arranged in order of use (outside in), with tines facing upwards.',
            ],
            [
                'question_text' => 'Where is the Water Goblet positioned on a standard formal table cover?',
                'options' => [
                    ['key' => 'A', 'text' => 'Directly to the left of the bread and butter plate'],
                    ['key' => 'B', 'text' => 'Directly above the dinner knife tip on the right side of the cover'],
                    ['key' => 'C', 'text' => 'In the exact center of the showplate'],
                    ['key' => 'D', 'text' => 'On the lower left corner of the placemat'],
                ],
                'correct_answer' => 'B',
                'points' => 1,
                'explanation' => 'The water goblet is anchored directly at the tip of the dinner knife on the right-hand side, serving as the benchmark for other glassware.',
            ],
            [
                'question_text' => 'What is the proper placement for the Bread and Butter (B&B) plate and butter spreader knife?',
                'options' => [
                    ['key' => 'A', 'text' => 'To the upper right above the coffee cup'],
                    ['key' => 'B', 'text' => 'To the upper left of the cover, with the spreader knife laid across the plate'],
                    ['key' => 'C', 'text' => 'Underneath the soup bowl'],
                    ['key' => 'D', 'text' => 'Directly below the dinner fork'],
                ],
                'correct_answer' => 'B',
                'points' => 1,
                'explanation' => 'The B&B plate is positioned at the upper left of the cover (above the forks) with the butter spreader resting across it.',
            ],
            [
                'question_text' => "What is the primary hygienic rule when folding cloth napkins demonstrated in \"{$title}\"?",
                'options' => [
                    ['key' => 'A', 'text' => 'Wetting fingers with saliva to crease the napkin fabric'],
                    ['key' => 'B', 'text' => 'Folding on clean, sanitized work surfaces with thoroughly washed hands and minimal direct handling'],
                    ['key' => 'C', 'text' => 'Using heavy spray perfume on the linen to provide aroma'],
                    ['key' => 'D', 'text' => 'Storing folded napkins on the floor under the sideboard'],
                ],
                'correct_answer' => 'B',
                'points' => 1,
                'explanation' => 'Napkins touch the guest\'s lips and hands, requiring pristine sanitation, clean flat surfaces, and minimal contact during folding.',
            ],
            [
                'question_text' => 'Which direction should the cutting edge (blade) of the dinner knife face when laid on the table?',
                'options' => [
                    ['key' => 'A', 'text' => 'Facing outward to the right toward neighboring guests'],
                    ['key' => 'B', 'text' => 'Facing inward toward the plate'],
                    ['key' => 'C', 'text' => 'Facing straight upward toward the ceiling'],
                    ['key' => 'D', 'text' => 'It does not matter as long as it is straight'],
                ],
                'correct_answer' => 'B',
                'points' => 1,
                'explanation' => 'Knife blades must always face inward toward the plate as a gesture of non-aggression and dining etiquette.',
            ],
            [
                'question_text' => 'What is the rule of thumb regarding the order of flatware placement for a multi-course dinner?',
                'options' => [
                    ['key' => 'A', 'text' => 'Flatware used first is placed on the outermost positions, working inward as courses proceed'],
                    ['key' => 'B', 'text' => 'The heaviest utensil is always placed closest to the plate'],
                    ['key' => 'C', 'text' => 'Dessert spoons are placed on the far left side outermost'],
                    ['key' => 'D', 'text' => 'All flatware is stacked in a neat pile on the napkin'],
                ],
                'correct_answer' => 'A',
                'points' => 1,
                'explanation' => 'Cutlery is laid in sequence of use from outside to inside, allowing the guest to intuitively reach for outer utensils first.',
            ],
            [
                'question_text' => 'Where should dessert utensils (spoon and fork) be placed on a formal banquet cover?',
                'options' => [
                    ['key' => 'A', 'text' => 'Horizontally above the top edge of the cover / showplate'],
                    ['key' => 'B', 'text' => 'Tucked underneath the napkin fold'],
                    ['key' => 'C', 'text' => 'To the far right beside the soup spoon'],
                    ['key' => 'D', 'text' => 'Inside the dessert bowl before serving'],
                ],
                'correct_answer' => 'A',
                'points' => 1,
                'explanation' => 'Dessert utensils are placed horizontally above the showplate: fork handle pointing left, spoon handle pointing right.',
            ],
            [
                'question_text' => 'What is the purpose of placing a silence cloth (molleton) under the main tablecloth?',
                'options' => [
                    ['key' => 'A', 'text' => 'To hide food scraps dropped on the table'],
                    ['key' => 'B', 'text' => 'To dampen clatter of dinnerware, prevent slipping, and protect the table surface from heat'],
                    ['key' => 'C', 'text' => 'To make the table uneven'],
                    ['key' => 'D', 'text' => 'To make chairs easier to pull'],
                ],
                'correct_answer' => 'B',
                'points' => 1,
                'explanation' => 'A silence cloth deadens noise from cutlery and plates, adds a luxurious plush feel, and protects the table surface from heat.',
            ],
            [
                'question_text' => "What standard napkin fold is commonly utilized when standing vertically in a water goblet as illustrated in \"{$title}\"?",
                'options' => [
                    ['key' => 'A', 'text' => 'The Fan or Bird of Paradise fold'],
                    ['key' => 'B', 'text' => 'The Simple Square flat fold'],
                    ['key' => 'C', 'text' => 'The Envelope fold'],
                    ['key' => 'D', 'text' => 'The Pocket fold'],
                ],
                'correct_answer' => 'A',
                'points' => 1,
                'explanation' => 'The Fan and Bird of Paradise folds provide structural height, making them ideal decorative folds for goblet presentation.',
            ],
        ];
    }

    /**
     * Food Safety & HACCP Question Pool (10 questions)
     */
    protected function getFoodSafetyQuestionPool(string $title): array
    {
        return [
            [
                'question_text' => "According to food safety standards highlighted in \"{$title}\", what is the Temperature Danger Zone (TDZ) where harmful bacteria multiply rapidly?",
                'options' => [
                    ['key' => 'A', 'text' => '0°C to 10°C (32°F to 50°F)'],
                    ['key' => 'B', 'text' => '5°C to 60°C (41°F to 140°F)'],
                    ['key' => 'C', 'text' => '70°C to 100°C (158°F to 212°F)'],
                    ['key' => 'D', 'text' => '-18°C to 0°C (0°F to 32°F)'],
                ],
                'correct_answer' => 'B',
                'points' => 1,
                'explanation' => 'Bacteria grow most rapidly in the Temperature Danger Zone between 5°C and 60°C (41°F to 140°F). Foods must not remain in this zone.',
            ],
            [
                'question_text' => 'What is the maximum cumulative time high-risk perishable foods can safely remain within the Temperature Danger Zone?',
                'options' => [
                    ['key' => 'A', 'text' => '2 to 4 hours maximum (the 2-Hour / 4-Hour Rule)'],
                    ['key' => 'B', 'text' => '8 to 10 hours'],
                    ['key' => 'C', 'text' => '24 hours if covered'],
                    ['key' => 'D', 'text' => 'Indefinitely if salted'],
                ],
                'correct_answer' => 'A',
                'points' => 1,
                'explanation' => 'Under international food safety codes, potentially hazardous food in the TDZ must be served/refrigerated within 2 hours or discarded after 4 hours.',
            ],
            [
                'question_text' => 'Which cutting board color coding system correctly prevents cross-contamination in food preparation?',
                'options' => [
                    ['key' => 'A', 'text' => 'Red for raw meat, Green for produce/fruits, Yellow for raw poultry, Blue for raw seafood'],
                    ['key' => 'B', 'text' => 'Red for salad greens, Blue for cooked roast, White for poultry'],
                    ['key' => 'C', 'text' => 'Any board color can be used for any ingredient without washing'],
                    ['key' => 'D', 'text' => 'Green for raw chicken, Brown for fresh fruits'],
                ],
                'correct_answer' => 'A',
                'points' => 1,
                'explanation' => 'Standard HACCP color coding designates Red for raw red meat, Yellow for raw poultry, Blue for seafood, and Green for fruits/vegetables.',
            ],
            [
                'question_text' => 'What is the minimum safe internal cooking temperature for poultry (chicken and turkey)?',
                'options' => [
                    ['key' => 'A', 'text' => '50°C (122°F)'],
                    ['key' => 'B', 'text' => '60°C (140°F)'],
                    ['key' => 'C', 'text' => '74°C (165°F) for at least 15 seconds'],
                    ['key' => 'D', 'text' => '45°C (113°F)'],
                ],
                'correct_answer' => 'C',
                'points' => 1,
                'explanation' => 'Poultry must reach an internal temperature of at least 74°C (165°F) to ensure Salmonella and Campylobacter are eliminated.',
            ],
            [
                'question_text' => 'What is the minimum duration recommended for proper handwashing with warm water and antibacterial soap?',
                'options' => [
                    ['key' => 'A', 'text' => '3 seconds rinse'],
                    ['key' => 'B', 'text' => 'At least 20 seconds of vigorous scrubbing (including palms, back of hands, fingers, and nails)'],
                    ['key' => 'C', 'text' => '1 minute with bleach'],
                    ['key' => 'D', 'text' => 'Only after handling garbage, never before cooking'],
                ],
                'correct_answer' => 'B',
                'points' => 1,
                'explanation' => 'Thorough handwashing requires at least 20 seconds of vigorous friction using soap and warm water, covering all hand surfaces.',
            ],
            [
                'question_text' => "What does the food safety storage acronym FIFO stand for in \"{$title}\"?",
                'options' => [
                    ['key' => 'A', 'text' => 'First In, First Out'],
                    ['key' => 'B', 'text' => 'Fast Inspection for Orders'],
                    ['key' => 'C', 'text' => 'Freeze Items For Others'],
                    ['key' => 'D', 'text' => 'Final Ingredient For Oven'],
                ],
                'correct_answer' => 'A',
                'points' => 1,
                'explanation' => 'FIFO (First In, First Out) ensures that older inventory stock is utilized before newer deliveries to maintain freshness and prevent spoilage.',
            ],
            [
                'question_text' => 'Where should raw meats be stored in a commercial upright refrigerator?',
                'options' => [
                    ['key' => 'A', 'text' => 'On the highest shelf above ready-to-eat salads'],
                    ['key' => 'B', 'text' => 'On the lowest shelves below cooked foods and fresh produce'],
                    ['key' => 'C', 'text' => 'Directly inside the ice maker compartment'],
                    ['key' => 'D', 'text' => 'Uncovered on door racks'],
                ],
                'correct_answer' => 'B',
                'points' => 1,
                'explanation' => 'Raw meats must always be stored on the bottom shelves to prevent juices from dripping onto cooked foods or ready-to-eat produce.',
            ],
            [
                'question_text' => 'What is the difference between cleaning and sanitizing in hospitality operations?',
                'options' => [
                    ['key' => 'A', 'text' => 'They mean the exact same thing'],
                    ['key' => 'B', 'text' => 'Cleaning removes visible soil and grease; sanitizing reduces harmful microorganisms to safe public health levels'],
                    ['key' => 'C', 'text' => 'Cleaning uses heat; sanitizing only uses cold water'],
                    ['key' => 'D', 'text' => 'Sanitizing must be done before cleaning'],
                ],
                'correct_answer' => 'B',
                'points' => 1,
                'explanation' => 'Cleaning removes debris, dirt, and organic material, whereas sanitizing applies heat or chemical agents to reduce pathogens to safe levels.',
            ],
            [
                'question_text' => 'What is the safest approved method for thawing frozen meats in a professional kitchen?',
                'options' => [
                    ['key' => 'A', 'text' => 'Leaving on the kitchen counter at room temperature overnight'],
                    ['key' => 'B', 'text' => 'Thawing inside the refrigerator at 4°C or below, or under cold running potable water'],
                    ['key' => 'C', 'text' => 'Submerging in hot boiling water on the floor'],
                    ['key' => 'D', 'text' => 'Placing directly under sunlight'],
                ],
                'correct_answer' => 'B',
                'points' => 1,
                'explanation' => 'Thawing must occur under controlled temperatures (refrigerator below 4°C, microwave as part of cooking, or cold running water).',
            ],
            [
                'question_text' => 'If a food handler experiences symptoms of vomiting, diarrhea, or jaundice, what action is mandatory?',
                'options' => [
                    ['key' => 'A', 'text' => 'Continue working but wear gloves and an extra apron'],
                    ['key' => 'B', 'text' => 'Immediately report to management, be excluded from food operations, and seek medical clearance'],
                    ['key' => 'C', 'text' => 'Switch to only washing dishes in the back'],
                    ['key' => 'D', 'text' => 'Drink hot coffee and continue serving guests'],
                ],
                'correct_answer' => 'B',
                'points' => 1,
                'explanation' => 'Staff showing gastrointestinal or jaundice symptoms must be strictly excluded from the food service facility to prevent foodborne illness outbreaks.',
            ],
        ];
    }

    /**
     * Service Styles (French, Russian, American, Gueridon) Question Pool (10 questions)
     */
    protected function getServiceStyleQuestionPool(string $title): array
    {
        return [
            [
                'question_text' => "What is the defining characteristic of American Service (Plate Service) explained in \"{$title}\"?",
                'options' => [
                    ['key' => 'A', 'text' => 'Food is pre-portioned and plated in the kitchen and brought directly to the table on individual plates'],
                    ['key' => 'B', 'text' => 'Food is cooked from raw on a mobile cart directly in front of the diner'],
                    ['key' => 'C', 'text' => 'Guests serve themselves from a long buffet table'],
                    ['key' => 'D', 'text' => 'Food is passed in large communal bowls for family self-service'],
                ],
                'correct_answer' => 'A',
                'points' => 1,
                'explanation' => 'American service plates all components in the kitchen, enabling high portion control, fast service, and consistent presentation.',
            ],
            [
                'question_text' => 'In traditional table service, which side of the guest should plated food dishes be served from?',
                'options' => [
                    ['key' => 'A', 'text' => 'From the guest\'s left side using the left hand'],
                    ['key' => 'B', 'text' => 'From the guest\'s right side using the right hand (or left side depending on American/Continental convention)'],
                    ['key' => 'C', 'text' => 'Directly overhead across the guest\'s face'],
                    ['key' => 'D', 'text' => 'Handed over to the guest to place on their own plate'],
                ],
                'correct_answer' => 'A',
                'points' => 1,
                'explanation' => 'In classical service rules, food is served from the guest\'s left side using the left hand, and beverages are served from the right.',
            ],
            [
                'question_text' => 'Which dining service style utilizes a mobile cooking cart called a "Guéridon" for tableside preparation and carving?',
                'options' => [
                    ['key' => 'A', 'text' => 'French Service (Service à la Française)'],
                    ['key' => 'B', 'text' => 'Quick Service / Fast Food'],
                    ['key' => 'C', 'text' => 'Counter Cafeteria Service'],
                    ['key' => 'D', 'text' => 'Buffet Line Service'],
                ],
                'correct_answer' => 'A',
                'points' => 1,
                'explanation' => 'French Gueridon service features dishes cooked, carved, or flambéed tableside on a mobile cart (guéridon) by a chef de rang.',
            ],
            [
                'question_text' => 'How is food presented and served in classical Russian Service (Platter Service)?',
                'options' => [
                    ['key' => 'A', 'text' => 'Food is arranged on silver platters in the kitchen and served to guests from the platter from their left side'],
                    ['key' => 'B', 'text' => 'Food is served cold in takeout containers'],
                    ['key' => 'C', 'text' => 'Guests cook their own food on hot stones placed on the table'],
                    ['key' => 'D', 'text' => 'Beverages are served before food orders are taken'],
                ],
                'correct_answer' => 'A',
                'points' => 1,
                'explanation' => 'In Russian service, exquisitely arranged silver platters are brought to the table; the server transfers portions to the guest\'s plate from the left.',
            ],
            [
                'question_text' => 'From which side should soiled plates and used cutlery be cleared from the guest?',
                'options' => [
                    ['key' => 'A', 'text' => 'From the right side using the right hand, with permission'],
                    ['key' => 'B', 'text' => 'From the left side by pulling the plate across the guest'],
                    ['key' => 'C', 'text' => 'While the guest is in mid-chew without saying a word'],
                    ['key' => 'D', 'text' => 'Only after the guest leaves the restaurant building'],
                ],
                'correct_answer' => 'A',
                'points' => 1,
                'explanation' => 'Dirty tableware is cleared from the guest\'s right side using the right hand, politely asking: "May I clear your plate?"',
            ],
            [
                'question_text' => "What is the three-plate carrying technique practiced in professional dining related to \"{$title}\"?",
                'options' => [
                    ['key' => 'A', 'text' => 'Balancing three plates on top of each other on the server\'s head'],
                    ['key' => 'B', 'text' => 'Carrying two plates securely on the left hand/wrist/fingers and the third plate with the right hand'],
                    ['key' => 'C', 'text' => 'Sliding plates along the dining table surface'],
                    ['key' => 'D', 'text' => 'Carrying all three plates in a plastic bag'],
                ],
                'correct_answer' => 'B',
                'points' => 1,
                'explanation' => 'The three-plate carrying method securely holds plate #1 in the left thumb/forefinger, plate #2 on the wrist/remaining fingers, and plate #3 in the right hand.',
            ],
            [
                'question_text' => 'In English Service (Family style / Host service), who typically carves and portions the meat?',
                'options' => [
                    ['key' => 'A', 'text' => 'The host seated at the head of the dining table'],
                    ['key' => 'B', 'text' => 'The kitchen dishwasher'],
                    ['key' => 'C', 'text' => 'Each guest walks into the kitchen to cut their own slice'],
                    ['key' => 'D', 'text' => 'The restaurant cashier'],
                ],
                'correct_answer' => 'A',
                'points' => 1,
                'explanation' => 'In English host service, the host portions main roasts from platters placed at the head of the table, and servers pass plates to guests.',
            ],
            [
                'question_text' => 'What is the "crumbing down" procedure in fine dining?',
                'options' => [
                    ['key' => 'A', 'text' => 'Sprinkling breadcrumbs intentionally over guest food for texture'],
                    ['key' => 'B', 'text' => 'Removing breadcrumbs from the tablecloth using a crumber tool or clean folded napkin before dessert'],
                    ['key' => 'C', 'text' => 'Throwing dirty linens onto the floor'],
                    ['key' => 'D', 'text' => 'Breaking crackers into the soup bowl'],
                ],
                'correct_answer' => 'B',
                'points' => 1,
                'explanation' => 'Crumbing the table is conducted after the main course is cleared and before dessert to ensure a pristine dining surface.',
            ],
            [
                'question_text' => 'When a banquet event has multiple courses, how should wine glasses be cleared?',
                'options' => [
                    ['key' => 'A', 'text' => 'Cleared only when the guest finishes all courses and is about to exit'],
                    ['key' => 'B', 'text' => 'Cleared after each respective wine pairing course is finished, leaving the water goblet on the table'],
                    ['key' => 'C', 'text' => 'Poured together into a single large tumbler'],
                    ['key' => 'D', 'text' => 'Never cleared during service'],
                ],
                'correct_answer' => 'B',
                'points' => 1,
                'explanation' => 'Specific course glassware (e.g. white wine glass after fish) is cleared once that course is concluded, keeping the water goblet throughout.',
            ],
            [
                'question_text' => 'What is the etiquette when a guest drops a piece of flatware on the floor?',
                'options' => [
                    ['key' => 'A', 'text' => 'Pick it up, wipe it on your apron, and place it back in front of the guest'],
                    ['key' => 'B', 'text' => 'Immediately replace it with a fresh sanitized utensil on a small tray/napkin, then remove the dropped utensil'],
                    ['key' => 'C', 'text' => 'Tell the guest to continue eating without utensils'],
                    ['key' => 'D', 'text' => 'Scold the guest for dropping the utensil'],
                ],
                'correct_answer' => 'B',
                'points' => 1,
                'explanation' => 'A server must promptly bring a fresh sanitized replacement on a service plate, then discreetly remove the fallen item from the floor.',
            ],
        ];
    }

    /**
     * Order Taking, Guest Service & Communication Question Pool (10 questions)
     */
    protected function getOrderTakingQuestionPool(string $title): array
    {
        return [
            [
                'question_text' => "When approaching guests for initial greeting and order taking in \"{$title}\", within what timeframe should the server greet them?",
                'options' => [
                    ['key' => 'A', 'text' => 'Within 30 seconds to 1 minute of being seated'],
                    ['key' => 'B', 'text' => 'After 15 minutes of silence'],
                    ['key' => 'C', 'text' => 'Only after the guest knocks on the table'],
                    ['key' => 'D', 'text' => 'At the end of the shift'],
                ],
                'correct_answer' => 'A',
                'points' => 1,
                'explanation' => 'Industry benchmark requires servers to warmly acknowledge guests within 30 to 60 seconds of seating with menus and water service.',
            ],
            [
                'question_text' => 'What is the professional practice of "upselling" during order taking?',
                'options' => [
                    ['key' => 'A', 'text' => 'Forcing guests to buy the most expensive item on the menu against their wishes'],
                    ['key' => 'B', 'text' => 'Suggesting complementary appetizers, wine pairings, or premium upgrades that enhance the dining experience'],
                    ['key' => 'C', 'text' => 'Charging extra fees without the customer\'s knowledge'],
                    ['key' => 'D', 'text' => 'Refusing to take orders for low-priced items'],
                ],
                'correct_answer' => 'B',
                'points' => 1,
                'explanation' => 'Upselling and suggestive selling involves recommending harmonious appetizers, drinks, or sides that genuinely elevate guest satisfaction.',
            ],
            [
                'question_text' => 'Why must a server repeat the complete order back to the guests before sending it to the kitchen?',
                'options' => [
                    ['key' => 'A', 'text' => 'To memorize the price of the meal'],
                    ['key' => 'B', 'text' => 'To confirm accuracy, dietary restrictions, cooking preferences, and prevent billing errors'],
                    ['key' => 'C', 'text' => 'To make other tables listen to the order'],
                    ['key' => 'D', 'text' => 'Because POS systems cannot store records'],
                ],
                'correct_answer' => 'B',
                'points' => 1,
                'explanation' => 'Repeating the order verifies all items, doneness (e.g. steak temperatures), modifications, and allergies, eliminating kitchen waste.',
            ],
            [
                'question_text' => 'What should a server do immediately if a guest informs them of a severe food allergy (e.g. shellfish, peanuts)?',
                'options' => [
                    ['key' => 'A', 'text' => 'Assure them the chef will pick out the peanuts by hand afterwards'],
                    ['key' => 'B', 'text' => 'Clearly alert the kitchen chef/manager, note the allergy boldly on the ticket, and ensure allergen-free preparation'],
                    ['key' => 'C', 'text' => 'Ignore the comment if the dining room is busy'],
                    ['key' => 'D', 'text' => 'Suggest they eat at home instead'],
                ],
                'correct_answer' => 'B',
                'points' => 1,
                'explanation' => 'Allergies can be life-threatening. Servers must notify the kitchen management immediately and document strict allergen protocols on the POS ticket.',
            ],
            [
                'question_text' => 'What is the standard procedure when a guest complains that their food is cold or undercooked?',
                'options' => [
                    ['key' => 'A', 'text' => 'Argue with the guest and insist the temperature is correct'],
                    ['key' => 'B', 'text' => 'Listen empathetically, apologize sincerely, remove the dish immediately, notify management, and expedite a fresh replacement'],
                    ['key' => 'C', 'text' => 'Microwave the half-eaten plate at the bar'],
                    ['key' => 'D', 'text' => 'Tell the guest to complain to the kitchen dishwashers'],
                ],
                'correct_answer' => 'B',
                'points' => 1,
                'explanation' => 'Service recovery utilizes the LAST method (Listen, Apologize, Solve, Thank) by taking swift action to replace the item and delight the guest.',
            ],
            [
                'question_text' => 'When presenting the guest check (bill) at the end of the meal, what is the professional protocol?',
                'options' => [
                    ['key' => 'A', 'text' => 'Slapping the receipt openly on the table during the main course'],
                    ['key' => 'B', 'text' => 'Presenting the check inside a clean bill folder face down to the host from the right, only when requested or table is cleared'],
                    ['key' => 'C', 'text' => 'Asking each person at the table out loud how much money they have'],
                    ['key' => 'D', 'text' => 'Shouting the total bill across the dining room'],
                ],
                'correct_answer' => 'B',
                'points' => 1,
                'explanation' => 'Bills are presented discreetly in a bill folder or booklet, placed face down on the right side of the host without rushing their departure.',
            ],
            [
                'question_text' => "What is the key purpose of table numbering and pivot point seating systems in \"{$title}\"?",
                'options' => [
                    ['key' => 'A', 'text' => 'To enable any server or food runner to deliver the exact dish to the correct guest without auctioning food'],
                    ['key' => 'B', 'text' => 'To count how many chairs are broken in the restaurant'],
                    ['key' => 'C', 'text' => 'To keep track of which guest tipped the most'],
                    ['key' => 'D', 'text' => 'To force guests to sit in alphabetical order'],
                ],
                'correct_answer' => 'A',
                'points' => 1,
                'explanation' => 'Pivot point numbering assigns each chair an exact number so food runners place each plate seamlessly without asking "Who ordered the steak?".',
            ],
            [
                'question_text' => 'How should a server handle change (cash payment) returned to the guest?',
                'options' => [
                    ['key' => 'A', 'text' => 'Keep the change in their own pocket and assume it is a tip'],
                    ['key' => 'B', 'text' => 'Return the exact change and receipt in the bill folder promptly, allowing the guest to decide on the tip'],
                    ['key' => 'C', 'text' => 'Throw the coins on the table'],
                    ['key' => 'D', 'text' => 'Ask the guest why they did not pay with credit card'],
                ],
                'correct_answer' => 'B',
                'points' => 1,
                'explanation' => 'All change must be returned promptly with the itemized receipt. Servers must never assume change is an automatic gratuity.',
            ],
            [
                'question_text' => 'What is the correct protocol when answering the restaurant telephone for a dining reservation?',
                'options' => [
                    ['key' => 'A', 'text' => 'Answer by saying "Hello, what do you want?"'],
                    ['key' => 'B', 'text' => 'Greet warmly with time of day, state restaurant name, your name, and offer assistance within 3 rings'],
                    ['key' => 'C', 'text' => 'Put the caller on hold immediately for 10 minutes without greeting'],
                    ['key' => 'D', 'text' => 'Let the phone ring until the caller hangs up'],
                ],
                'correct_answer' => 'B',
                'points' => 1,
                'explanation' => 'Telephone reservations set the first impression: answer within 3 rings with a polite greeting, establishment name, and your identity.',
            ],
            [
                'question_text' => 'When clearing dessert plates, which items should remain on the table until the guests depart?',
                'options' => [
                    ['key' => 'A', 'text' => 'Only the water goblets and after-dinner beverage cups (coffee/tea)'],
                    ['key' => 'B', 'text' => 'Dirty bread baskets and soiled soup spoons'],
                    ['key' => 'C', 'text' => 'All soiled dinner plates from every course'],
                    ['key' => 'D', 'text' => 'Empty condiment bottles and trash'],
                ],
                'correct_answer' => 'A',
                'points' => 1,
                'explanation' => 'Only active beverage glasses (water goblet, coffee cup, digestif) remain on the table; all other dinnerware and cutlery must be cleared.',
            ],
        ];
    }

    /**
     * Culinary & Kitchen Techniques Question Pool (10 questions)
     */
    protected function getCulinaryQuestionPool(string $title): array
    {
        return [
            [
                'question_text' => "What are the standard dimensions of a classical Brunoise knife cut highlighted in \"{$title}\"?",
                'options' => [
                    ['key' => 'A', 'text' => '1/8 inch × 1/8 inch × 1/8 inch (approx. 3mm cube)'],
                    ['key' => 'B', 'text' => '1 inch × 1 inch × 1 inch'],
                    ['key' => 'C', 'text' => '2 inches × 1/4 inch'],
                    ['key' => 'D', 'text' => 'Thin round slices like coins'],
                ],
                'correct_answer' => 'A',
                'points' => 1,
                'explanation' => 'Brunoise is a fine dice produced by cutting Julienne strips into 1/8 inch (3mm) precise cubes.',
            ],
            [
                'question_text' => 'What is the culinary term "Mise-en-place" translated from French?',
                'options' => [
                    ['key' => 'A', 'text' => 'Everything in its place (organizing and prepping all ingredients and tools prior to cooking)'],
                    ['key' => 'B', 'text' => 'Cooking very quickly under high pressure'],
                    ['key' => 'C', 'text' => 'Washing all dirty dishes in the kitchen sink'],
                    ['key' => 'D', 'text' => 'The final dessert course of a dinner'],
                ],
                'correct_answer' => 'A',
                'points' => 1,
                'explanation' => 'Mise-en-place means "everything in its place" — having all ingredients chopped, measured, and equipment ready before beginning service.',
            ],
            [
                'question_text' => 'What is the French culinary term for finely shredded leafy vegetables or herbs (such as basil or lettuce)?',
                'options' => [
                    ['key' => 'A', 'text' => 'Chiffonade'],
                    ['key' => 'B', 'text' => 'Mirepoix'],
                    ['key' => 'C', 'text' => 'Roux'],
                    ['key' => 'D', 'text' => 'Batonnet'],
                ],
                'correct_answer' => 'A',
                'points' => 1,
                'explanation' => 'Chiffonade is achieved by stacking leaves, rolling them tightly into a cylinder, and slicing thinly into ribbons.',
            ],
            [
                'question_text' => 'What ratio comprises the classical French Mirepoix base for stocks and sauces?',
                'options' => [
                    ['key' => 'A', 'text' => '50% Onions, 25% Carrots, 25% Celery by weight'],
                    ['key' => 'B', 'text' => '80% Garlic, 20% Ginger'],
                    ['key' => 'C', 'text' => '50% Potatoes, 50% Cabbage'],
                    ['key' => 'D', 'text' => 'Equal parts Sugar, Salt, and Pepper'],
                ],
                'correct_answer' => 'A',
                'points' => 1,
                'explanation' => 'Classical Mirepoix consists of 2 parts onion, 1 part carrot, and 1 part celery (2:1:1 ratio) cooked gently in fat or stock.',
            ],
            [
                'question_text' => 'What is a "Roux" in sauce making and what are its ingredients?',
                'options' => [
                    ['key' => 'A', 'text' => 'An equal weight mixture of flour and fat (usually butter) cooked together to thicken sauces'],
                    ['key' => 'B', 'text' => 'A cold salad dressing made with olive oil and vinegar'],
                    ['key' => 'C', 'text' => 'A sweet egg white meringue baked in an oven'],
                    ['key' => 'D', 'text' => 'A blend of raw starch and water mixed without heat'],
                ],
                'correct_answer' => 'A',
                'points' => 1,
                'explanation' => 'Roux is equal parts fat (butter) and flour cooked to white, blond, or brown stages to serve as the thickening foundation of mother sauces.',
            ],
            [
                'question_text' => 'Which of the following is NOT one of the five French classical "Mother Sauces" codified by Escoffier?',
                'options' => [
                    ['key' => 'A', 'text' => 'Béchamel'],
                    ['key' => 'B', 'text' => 'Velouté'],
                    ['key' => 'C', 'text' => 'Hollandaise'],
                    ['key' => 'D', 'text' => 'Chimichurri'],
                ],
                'correct_answer' => 'D',
                'points' => 1,
                'explanation' => 'The 5 mother sauces are Béchamel, Velouté, Espagnole, Sauce Tomat, and Hollandaise. Chimichurri is an Argentine herb condiment.',
            ],
            [
                'question_text' => 'What cooking method is defined as submerging food into liquid held just below the boiling point (between 71°C to 82°C / 160°F to 180°F)?',
                'options' => [
                    ['key' => 'A', 'text' => 'Poaching'],
                    ['key' => 'B', 'text' => 'Deep frying'],
                    ['key' => 'C', 'text' => 'Roasting'],
                    ['key' => 'D', 'text' => 'Sautéing'],
                ],
                'correct_answer' => 'A',
                'points' => 1,
                'explanation' => 'Poaching gently cooks delicate proteins (eggs, fish, poultry) in liquid without vigorous boiling bubbles that would damage the food.',
            ],
            [
                'question_text' => "What is the standard internal temperature for a steak cooked to 'Medium Rare'?",
                'options' => [
                    ['key' => 'A', 'text' => '54°C to 57°C (130°F to 135°F) with a warm red/pink center'],
                    ['key' => 'B', 'text' => '77°C (170°F) completely grey throughout'],
                    ['key' => 'C', 'text' => '40°C (104°F) cold raw center'],
                    ['key' => 'D', 'text' => '95°C (203°F) boiling temperature'],
                ],
                'correct_answer' => 'A',
                'points' => 1,
                'explanation' => 'Medium rare beef reaches an internal core of 54°C to 57°C (130°F to 135°F), characterized by maximum tenderness and rich juiciness.',
            ],
            [
                'question_text' => 'What is the purpose of resting cooked roasted or grilled meat before slicing?',
                'options' => [
                    ['key' => 'A', 'text' => 'To let the meat get cold and stiff'],
                    ['key' => 'B', 'text' => 'To allow the muscle fibers to relax and juices to redistribute evenly throughout the meat'],
                    ['key' => 'C', 'text' => 'To prevent the cutting board from being washed'],
                    ['key' => 'D', 'text' => 'Because restaurants run out of plates'],
                ],
                'correct_answer' => 'B',
                'points' => 1,
                'explanation' => 'Resting meat allows internal pressure to subside and juices to reabsorb into meat fibers, preventing all juices from spilling onto the board.',
            ],
            [
                'question_text' => 'What is the safe holding temperature for hot foods maintained on a buffet line?',
                'options' => [
                    ['key' => 'A', 'text' => 'At least 60°C (140°F) or above at all times'],
                    ['key' => 'B', 'text' => 'Room temperature (25°C)'],
                    ['key' => 'C', 'text' => 'Below 30°C'],
                    ['key' => 'D', 'text' => 'Any temperature if covered with plastic wrap'],
                ],
                'correct_answer' => 'A',
                'points' => 1,
                'explanation' => 'Hot buffet foods must be continuously held at or above 60°C (140°F) in chafing dishes to prevent bacterial growth.',
            ],
        ];
    }

    /**
     * General Hospitality & F&B Competency Pool
     */
    protected function getGeneralHospitalityPool(string $title): array
    {
        return [
            [
                'question_text' => "What is the primary instructional goal of the learning material \"{$title}\"?",
                'options' => [
                    ['key' => 'A', 'text' => 'To establish mastery of standard operational procedures and professional competency in F&B services'],
                    ['key' => 'B', 'text' => 'To replace in-person laboratory practical examinations completely'],
                    ['key' => 'C', 'text' => 'To teach basic computer programming skills'],
                    ['key' => 'D', 'text' => 'To bypass TESDA assessment guidelines'],
                ],
                'correct_answer' => 'A',
                'points' => 1,
                'explanation' => 'This training module instills standard operating procedures and technical skills required in professional hospitality operations.',
            ],
            [
                'question_text' => 'What is the professional standard for server grooming and personal hygiene in food and beverage services?',
                'options' => [
                    ['key' => 'A', 'text' => 'Clean pressed uniform, hair neatly restrained, trimmed nails, minimal jewelry, and high personal hygiene'],
                    ['key' => 'B', 'text' => 'Wearing casual streetwear and heavy cologne or perfume'],
                    ['key' => 'C', 'text' => 'Long unclipped fingernails with brightly chipped polish'],
                    ['key' => 'D', 'text' => 'Wearing sports watches and loose dangling necklaces over food trays'],
                ],
                'correct_answer' => 'A',
                'points' => 1,
                'explanation' => 'Professional grooming requires spotless uniforms, hair restrained, clean trimmed nails without polish, and zero strong perfumes that interfere with food aromas.',
            ],
            [
                'question_text' => 'When carrying a round service tray loaded with glassware, what is the correct hand positioning?',
                'options' => [
                    ['key' => 'A', 'text' => 'Balanced on the palm and fingertips of the non-dominant hand directly over the center of gravity'],
                    ['key' => 'B', 'text' => 'Carried with two fingers by the edge of the rim'],
                    ['key' => 'C', 'text' => 'Rested on top of the shoulder leaning against the wall'],
                    ['key' => 'D', 'text' => 'Balanced on the server\'s hip while walking'],
                ],
                'correct_answer' => 'A',
                'points' => 1,
                'explanation' => 'Trays must be centered over the palm and outstretched fingertips of the non-dominant hand at waist level, keeping the dominant hand free to serve.',
            ],
            [
                'question_text' => 'How should heavy items be arranged on a service tray for maximum stability?',
                'options' => [
                    ['key' => 'A', 'text' => 'Stacked on the outer rim of the tray'],
                    ['key' => 'B', 'text' => 'Placed in the center of the tray closest to the server\'s body to maintain balance'],
                    ['key' => 'C', 'text' => 'Arranged only on one side to test server wrist strength'],
                    ['key' => 'D', 'text' => 'Placed upside down'],
                ],
                'correct_answer' => 'B',
                'points' => 1,
                'explanation' => 'Heaviest and tallest items are placed in the center of the tray closest to the server\'s torso to maintain equilibrium and prevent tipping.',
            ],
            [
                'question_text' => "Why is knowledge retention from \"{$title}\" critical for industry workplace safety?",
                'options' => [
                    ['key' => 'A', 'text' => 'It prevents workplace injuries, equipment breakage, cross-contamination, and guest dissatisfaction'],
                    ['key' => 'B', 'text' => 'It reduces the number of hours students must sleep'],
                    ['key' => 'C', 'text' => 'It eliminates the need for cleaning duties'],
                    ['key' => 'D', 'text' => 'It enables students to skip inventory checks'],
                ],
                'correct_answer' => 'A',
                'points' => 1,
                'explanation' => 'Adhering to standard operating procedures prevents spills, burns, glass cuts, contamination, and costly service errors.',
            ],
            [
                'question_text' => 'What is the proper etiquette when presenting the menu to dining guests?',
                'options' => [
                    ['key' => 'A', 'text' => 'Tossing the menu across the table toward the center'],
                    ['key' => 'B', 'text' => 'Presenting the menu right side up, opened to the first page, from the guest\'s right side'],
                    ['key' => 'C', 'text' => 'Asking the guests to download a photo from the server\'s personal phone'],
                    ['key' => 'D', 'text' => 'Reading the entire menu out loud word for word without permission'],
                ],
                'correct_answer' => 'B',
                'points' => 1,
                'explanation' => 'Menus should be handed cleanly, right side up, open to the initial page from the guest\'s right side, allowing comfortable perusal.',
            ],
            [
                'question_text' => 'What is the role of an expediter (aboyeur) on the kitchen pass during peak dinner rush?',
                'options' => [
                    ['key' => 'A', 'text' => 'To wash the kitchen floor during cooking'],
                    ['key' => 'B', 'text' => 'To coordinate orders between kitchen and waitstaff, inspect plate presentation, ensure completeness, and call food runners'],
                    ['key' => 'C', 'text' => 'To eat portions of the food before it leaves the kitchen'],
                    ['key' => 'D', 'text' => 'To manage the restaurant social media accounts'],
                ],
                'correct_answer' => 'B',
                'points' => 1,
                'explanation' => 'The expediter bridges the kitchen and dining room, verifying ticket accuracy, garnish quality, plate rim cleanliness, and timing of dishes.',
            ],
            [
                'question_text' => 'In banquet service, what is a "BEO" and what is its primary function?',
                'options' => [
                    ['key' => 'A', 'text' => 'Banquet Event Order — the master blueprint outlining headcount, timeline, menu, setup, and VIP requirements'],
                    ['key' => 'B', 'text' => 'Basic Electronic Oven — used for reheating rolls'],
                    ['key' => 'C', 'text' => 'Beverage Evaluation Outcome — a cocktail tasting score'],
                    ['key' => 'D', 'text' => 'Busboy Entry Organization — an employee timesheet'],
                ],
                'correct_answer' => 'A',
                'points' => 1,
                'explanation' => 'The Banquet Event Order (BEO) is the definitive operational contract guiding kitchen, service, and banquet setup teams on every event detail.',
            ],
            [
                'question_text' => 'What is the standard procedure when a dining guest requests the bill while some guests at the table are still eating?',
                'options' => [
                    ['key' => 'A', 'text' => 'Discreetly present the bill inside a presenter to the requesting guest only, without interrupting those finishing their meal'],
                    ['key' => 'B', 'text' => 'Take away everyone\'s plates immediately so they finish at the same time'],
                    ['key' => 'C', 'text' => 'Refuse to give the bill until all plates are 100% empty'],
                    ['key' => 'D', 'text' => 'Loudly announce to the table that someone wants to pay now'],
                ],
                'correct_answer' => 'A',
                'points' => 1,
                'explanation' => 'Honor the requesting guest\'s timeline discreetly without rushing or disturbing companions who are still enjoying their meal.',
            ],
            [
                'question_text' => "Upon successfully mastering the procedures in \"{$title}\", how should an F&B professional verify that their station is closed at the end of the shift?",
                'options' => [
                    ['key' => 'A', 'text' => 'Perform closing side work, clean and sanitize all surfaces, replenish supplies for the next shift, and complete the duty checklist'],
                    ['key' => 'B', 'text' => 'Leave immediately when the clock hits the scheduled hour regardless of dirty dishes'],
                    ['key' => 'C', 'text' => 'Turn off lights while guests are still seated'],
                    ['key' => 'D', 'text' => 'Hide unwashed flatware in linen bags'],
                ],
                'correct_answer' => 'A',
                'points' => 1,
                'explanation' => 'A professional closing requires comprehensive side work: cleaning, restocking stations, sanitizing condiment caddies, and logging out properly.',
            ],
        ];
    }
}
