<?php

namespace Database\Seeders;

use App\Models\Assessment;
use App\Models\AssessmentQuestion;
use App\Models\AssessmentSubmission;
use App\Models\Resource;
use App\Models\User;
use Illuminate\Database\Seeder;

class AssessmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::where('email', 'admin@crt.edu.ph')->first() ?? User::where('role', 'admin')->first();
        $students = User::where('role', 'student')->get();
        $student1 = $students->firstWhere('email', 'student@crt.edu.ph') ?? $students->first();
        $student2 = $students->firstWhere('email', 'angela.bautista@crt.edu.ph') ?? $students->skip(1)->first();
        $student3 = $students->firstWhere('email', 'mark.tan@crt.edu.ph') ?? $students->skip(2)->first();

        // 1. Video Lesson: Espresso Extraction & Milk Steaming Technique
        $espressoResource = Resource::where('slug', 'espresso-extraction-and-milk-steaming')->first();
        if ($espressoResource) {
            $espressoAssessment = Assessment::firstOrCreate(
                ['resource_id' => $espressoResource->id],
                [
                    'title' => 'Espresso Extraction & Milk Texturing Competency Quiz',
                    'description' => 'Test your understanding of extraction times, brew ratios, grind size calibration, and microfoam milk temperatures.',
                    'passing_percentage' => 70,
                    'time_limit_minutes' => 15,
                    'is_published' => true,
                    'created_by' => $admin->id,
                ]
            );

            $this->seedQuestions($espressoAssessment, [
                [
                    'question_text' => 'What is the standard ideal extraction time for a classic 1:2 espresso double shot (18g dry coffee to ~36g espresso)?',
                    'options' => [
                        ['key' => 'A', 'text' => '10 to 15 seconds'],
                        ['key' => 'B', 'text' => '25 to 30 seconds'],
                        ['key' => 'C', 'text' => '45 to 60 seconds'],
                        ['key' => 'D', 'text' => '75 to 90 seconds'],
                    ],
                    'correct_answer' => 'B',
                    'points' => 1,
                    'order' => 1,
                    'explanation' => 'Standard specialty coffee extraction time for a balanced espresso double shot is typically 25 to 30 seconds.',
                ],
                [
                    'question_text' => 'What is the optimal temperature range when steaming milk for lattes and flat whites to prevent scorching milk proteins?',
                    'options' => [
                        ['key' => 'A', 'text' => '35°C to 45°C (Warm bath)'],
                        ['key' => 'B', 'text' => '60°C to 65°C (140°F to 150°F)'],
                        ['key' => 'C', 'text' => '85°C to 95°C (Near boiling)'],
                        ['key' => 'D', 'text' => '100°C (Boiling)'],
                    ],
                    'correct_answer' => 'B',
                    'points' => 1,
                    'order' => 2,
                    'explanation' => 'Milk proteins and natural sweetness are at their peak between 60°C and 65°C. Heating beyond 70°C degrades the foam and burns the lactose.',
                ],
                [
                    'question_text' => 'What visual texture indicates that milk has been steamed into proper microfoam rather than dry froth?',
                    'options' => [
                        ['key' => 'A', 'text' => 'Glossy surface resembling wet white paint with microscopic uniform bubbles'],
                        ['key' => 'B', 'text' => 'Large visible air bubbles that sit like stiff meringue on top'],
                        ['key' => 'C', 'text' => 'Completely translucent liquid without any foam layer'],
                        ['key' => 'D', 'text' => 'Chunky clotted milk peaks'],
                    ],
                    'correct_answer' => 'A',
                    'points' => 1,
                    'order' => 3,
                    'explanation' => 'High quality microfoam displays a velvety, glossy sheen similar to wet paint, allowing seamless latte art pouring.',
                ],
            ]);

            // Seed submissions for this assessment
            if ($student1) {
                AssessmentSubmission::firstOrCreate(
                    [
                        'assessment_id' => $espressoAssessment->id,
                        'user_id' => $student1->id,
                    ],
                    [
                        'score' => 3,
                        'total_points' => 3,
                        'percentage' => 100.00,
                        'status' => 'passed',
                        'answers' => [
                            '1' => 'B',
                            '2' => 'B',
                            '3' => 'A',
                        ],
                        'feedback' => 'Outstanding mastery of barista fundamentals! Perfect score.',
                        'submitted_at' => now()->subDays(2),
                    ]
                );
            }

            if ($student2) {
                AssessmentSubmission::firstOrCreate(
                    [
                        'assessment_id' => $espressoAssessment->id,
                        'user_id' => $student2->id,
                    ],
                    [
                        'score' => 2,
                        'total_points' => 3,
                        'percentage' => 66.67,
                        'status' => 'failed',
                        'answers' => [
                            '1' => 'B',
                            '2' => 'C',
                            '3' => 'A',
                        ],
                        'feedback' => 'Good effort! Please review milk steaming temperatures before retaking.',
                        'submitted_at' => now()->subDay(),
                    ]
                );
            }
        }

        // 2. Video Lesson: Formal Table Setup & Service Walkthrough
        $tableServiceResource = Resource::where('slug', 'formal-table-setup-and-service-walkthrough')->first();
        if ($tableServiceResource) {
            $tableAssessment = Assessment::firstOrCreate(
                ['resource_id' => $tableServiceResource->id],
                [
                    'title' => 'Formal Dining Room Service Protocol Assessment',
                    'description' => 'Evaluates guest service sequence, plate clearing sides, beverage service, and silver service rules.',
                    'passing_percentage' => 70,
                    'time_limit_minutes' => 15,
                    'is_published' => true,
                    'created_by' => $admin->id,
                ]
            );

            $this->seedQuestions($tableAssessment, [
                [
                    'question_text' => 'According to standard American/Continental banquet service protocol, from which side of the seated guest should food dishes be served?',
                    'options' => [
                        ['key' => 'A', 'text' => 'From the left side with the left hand'],
                        ['key' => 'B', 'text' => 'From the right side with the right hand'],
                        ['key' => 'C', 'text' => 'Directly overhead across the guest table'],
                        ['key' => 'D', 'text' => 'Whichever side has more physical room'],
                    ],
                    'correct_answer' => 'A',
                    'points' => 1,
                    'order' => 1,
                    'explanation' => 'The golden industry rule: "Serve from the left, clear from the right" (with beverages served and replenished from the right).',
                ],
                [
                    'question_text' => 'From which side of the guest should beverages (wine, water, coffee) always be poured and served?',
                    'options' => [
                        ['key' => 'A', 'text' => 'From the guest\'s left side'],
                        ['key' => 'B', 'text' => 'From the guest\'s right side'],
                        ['key' => 'C', 'text' => 'From either side randomly'],
                        ['key' => 'D', 'text' => 'Handing the bottle to the guest directly'],
                    ],
                    'correct_answer' => 'B',
                    'points' => 1,
                    'order' => 2,
                    'explanation' => 'Beverages and glassware are placed to the guest\'s upper right, so servers pour and clear beverages from the right.',
                ],
                [
                    'question_text' => 'When presenting a bottle of wine to the host who ordered it, how should the bottle be held?',
                    'options' => [
                        ['key' => 'A', 'text' => 'Label facing towards the host so they can read and verify vintage and producer'],
                        ['key' => 'B', 'text' => 'Label faced downward towards the floor to avoid smudges'],
                        ['key' => 'C', 'text' => 'Tucked tightly under the server\'s armpit'],
                        ['key' => 'D', 'text' => 'Already uncorked without showing the bottle'],
                    ],
                    'correct_answer' => 'A',
                    'points' => 1,
                    'order' => 3,
                    'explanation' => 'Always present the wine bottle resting on a clean service napkin with the label facing the host for confirmation before opening.',
                ],
            ]);

            if ($student1) {
                AssessmentSubmission::firstOrCreate(
                    [
                        'assessment_id' => $tableAssessment->id,
                        'user_id' => $student1->id,
                    ],
                    [
                        'score' => 3,
                        'total_points' => 3,
                        'percentage' => 100.00,
                        'status' => 'passed',
                        'answers' => [
                            '1' => 'A',
                            '2' => 'B',
                            '3' => 'A',
                        ],
                        'feedback' => 'Exceptional understanding of dining room service standards.',
                        'submitted_at' => now()->subHours(12),
                    ]
                );
            }

            if ($student3) {
                AssessmentSubmission::firstOrCreate(
                    [
                        'assessment_id' => $tableAssessment->id,
                        'user_id' => $student3->id,
                    ],
                    [
                        'score' => 3,
                        'total_points' => 3,
                        'percentage' => 100.00,
                        'status' => 'passed',
                        'answers' => [
                            '1' => 'A',
                            '2' => 'B',
                            '3' => 'A',
                        ],
                        'feedback' => 'Passed with honors! Well done Mark.',
                        'submitted_at' => now()->subHours(6),
                    ]
                );
            }
        }

        // 3. PDF Module: TESDA NC II Core Module 1: Prepare the Dining Room
        $tesdaResource = Resource::where('slug', 'tesda-nc-ii-core-module-1-prepare-dining-room')->first();
        if ($tesdaResource) {
            $tesdaAssessment = Assessment::firstOrCreate(
                ['resource_id' => $tesdaResource->id],
                [
                    'title' => 'TESDA NC II Core 1: Dining Room Readiness Quiz',
                    'description' => 'Covers checking dining room environment, taking reservations, setting tables according to standard, and station preparation.',
                    'passing_percentage' => 70,
                    'time_limit_minutes' => 20,
                    'is_published' => true,
                    'created_by' => $admin->id,
                ]
            );

            $this->seedQuestions($tesdaAssessment, [
                [
                    'question_text' => 'What is the distance standard between the edge of the dining table and the base of flatware / charger plate?',
                    'options' => [
                        ['key' => 'A', 'text' => '1 inch (approx. thumb knuckle distance) from the table edge'],
                        ['key' => 'B', 'text' => '4 inches from the table edge'],
                        ['key' => 'C', 'text' => 'Touching the edge directly or hanging over'],
                        ['key' => 'D', 'text' => '6 inches towards the table center'],
                    ],
                    'correct_answer' => 'A',
                    'points' => 1,
                    'order' => 1,
                    'explanation' => 'Standard TESDA and international banquet specifications dictate flatware should be aligned 1 inch from the edge of the table.',
                ],
                [
                    'question_text' => 'What is a "gueridon" in professional dining room service?',
                    'options' => [
                        ['key' => 'A', 'text' => 'A movable trolley or cart used for tableside cooking, carving, or flambéing'],
                        ['key' => 'B', 'text' => 'A type of heavy linen napkin'],
                        ['key' => 'C', 'text' => 'The main restaurant point-of-sale register'],
                        ['key' => 'D', 'text' => 'A large soup tureen'],
                    ],
                    'correct_answer' => 'A',
                    'points' => 1,
                    'order' => 2,
                    'explanation' => 'A gueridon is a dedicated mobile service trolley equipped for tableside preparation such as filleting fish or flambéing desserts.',
                ],
                [
                    'question_text' => 'When laying tablecloths on dining tables, what is the ideal uniform drop/overhang from the table edge to the chair seat?',
                    'options' => [
                        ['key' => 'A', 'text' => '10 to 12 inches (just above the chair seat)'],
                        ['key' => 'B', 'text' => '1 to 2 inches'],
                        ['key' => 'C', 'text' => 'Touching and bunching on the floor'],
                        ['key' => 'D', 'text' => 'No drop allowed'],
                    ],
                    'correct_answer' => 'A',
                    'points' => 1,
                    'order' => 3,
                    'explanation' => 'For standard meal service, an even drop of 10-12 inches on all sides looks neat and prevents tablecloth corners from tangling guest legs.',
                ],
            ]);

            if ($student2) {
                AssessmentSubmission::firstOrCreate(
                    [
                        'assessment_id' => $tesdaAssessment->id,
                        'user_id' => $student2->id,
                    ],
                    [
                        'score' => 3,
                        'total_points' => 3,
                        'percentage' => 100.00,
                        'status' => 'passed',
                        'answers' => [
                            '1' => 'A',
                            '2' => 'A',
                            '3' => 'A',
                        ],
                        'feedback' => 'Excellent work on TESDA dining room readiness!',
                        'submitted_at' => now()->subHours(20),
                    ]
                );
            }
        }

        // 4. PDF Module: HACCP Food Safety, Personal Hygiene & Sanitization Standards
        $haccpResource = Resource::where('slug', 'haccp-sanitation-and-food-hygiene-manual')->first();
        if ($haccpResource) {
            $haccpAssessment = Assessment::firstOrCreate(
                ['resource_id' => $haccpResource->id],
                [
                    'title' => 'HACCP & Sanitation Compliance Examination',
                    'description' => 'Assessment on food temperature danger zones, sanitizing chemical PPM, cross-contamination, and personal hygiene.',
                    'passing_percentage' => 70,
                    'time_limit_minutes' => 15,
                    'is_published' => true,
                    'created_by' => $admin->id,
                ]
            );

            $this->seedQuestions($haccpAssessment, [
                [
                    'question_text' => 'What is the temperature range of the "Temperature Danger Zone" where foodborne bacteria multiply most rapidly?',
                    'options' => [
                        ['key' => 'A', 'text' => '5°C to 60°C (41°F to 140°F)'],
                        ['key' => 'B', 'text' => '0°C to 4°C (32°F to 40°F)'],
                        ['key' => 'C', 'text' => '75°C to 100°C (167°F to 212°F)'],
                        ['key' => 'D', 'text' => '-18°C to 0°C (0°F to 32°F)'],
                    ],
                    'correct_answer' => 'A',
                    'points' => 1,
                    'order' => 1,
                    'explanation' => 'Between 5°C and 60°C bacteria double approximately every 20 minutes. Potentially hazardous foods must not remain in this zone longer than 2-4 hours.',
                ],
                [
                    'question_text' => 'What is the correct sequence in a professional manual three-compartment sink setup?',
                    'options' => [
                        ['key' => 'A', 'text' => 'Wash (Hot soapy water) -> Rinse (Clean hot water) -> Sanitize (Chemical/hot water)'],
                        ['key' => 'B', 'text' => 'Sanitize -> Wash -> Rinse'],
                        ['key' => 'C', 'text' => 'Rinse -> Dry with cloth -> Wash'],
                        ['key' => 'D', 'text' => 'Bleach soak -> Dry -> Air dry'],
                    ],
                    'correct_answer' => 'A',
                    'points' => 1,
                    'order' => 2,
                    'explanation' => 'The standard 3-sink sequence is always Wash (Sink 1), Rinse (Sink 2), and Sanitize (Sink 3), followed by air drying.',
                ],
                [
                    'question_text' => 'How long must food handlers scrub their hands with soap and water according to WHO and food safety guidelines?',
                    'options' => [
                        ['key' => 'A', 'text' => 'At least 20 seconds'],
                        ['key' => 'B', 'text' => '5 seconds quick rinse'],
                        ['key' => 'C', 'text' => '3 minutes with cold water'],
                        ['key' => 'D', 'text' => 'Only after handling raw poultry, otherwise not needed'],
                    ],
                    'correct_answer' => 'A',
                    'points' => 1,
                    'order' => 3,
                    'explanation' => 'Thorough lathering and scrubbing of fingers, thumbs, wrists, and fingernails for at least 20 seconds is mandatory.',
                ],
            ]);

            if ($student1) {
                AssessmentSubmission::firstOrCreate(
                    [
                        'assessment_id' => $haccpAssessment->id,
                        'user_id' => $student1->id,
                    ],
                    [
                        'score' => 3,
                        'total_points' => 3,
                        'percentage' => 100.00,
                        'status' => 'passed',
                        'answers' => [
                            '1' => 'A',
                            '2' => 'A',
                            '3' => 'A',
                        ],
                        'feedback' => 'Mastery achieved on critical sanitation standards.',
                        'submitted_at' => now()->subDays(3),
                    ]
                );
            }
        }

        // 5. Illustration: Formal 5-Course Dinner Table Cover Diagram
        $diagramResource = Resource::where('slug', 'formal-dinner-table-cover-diagram')->first();
        if ($diagramResource) {
            $diagramAssessment = Assessment::firstOrCreate(
                ['resource_id' => $diagramResource->id],
                [
                    'title' => 'Formal Table Cover Layout & Anatomy Quiz',
                    'description' => 'Test your identification of flatware order, glassware triangle arrangement, and bread plate positioning.',
                    'passing_percentage' => 70,
                    'time_limit_minutes' => 10,
                    'is_published' => true,
                    'created_by' => $admin->id,
                ]
            );

            $this->seedQuestions($diagramAssessment, [
                [
                    'question_text' => 'When a guest dines through multiple courses, which flatware is used first?',
                    'options' => [
                        ['key' => 'A', 'text' => 'The utensils furthest from the plate (working from the outside in)'],
                        ['key' => 'B', 'text' => 'The utensils closest to the plate (working from the inside out)'],
                        ['key' => 'C', 'text' => 'The dessert spoon placed above the plate'],
                        ['key' => 'D', 'text' => 'The dinner knife only for all courses'],
                    ],
                    'correct_answer' => 'A',
                    'points' => 1,
                    'order' => 1,
                    'explanation' => 'Table setting convention dictates that diners work from the outside in as each course is presented.',
                ],
                [
                    'question_text' => 'On which side of the cover is the bread and butter plate (B&B plate) with the butter spreader positioned?',
                    'options' => [
                        ['key' => 'A', 'text' => 'Upper left side, above the forks'],
                        ['key' => 'B', 'text' => 'Upper right side, above the knives'],
                        ['key' => 'C', 'text' => 'Directly centered in the middle of the cover'],
                        ['key' => 'D', 'text' => 'On the guest\'s chair'],
                    ],
                    'correct_answer' => 'A',
                    'points' => 1,
                    'order' => 2,
                    'explanation' => 'The bread plate is situated to the upper left of the place setting, above the dinner and salad forks.',
                ],
            ]);
        }

        // 6. Text Lesson: Foundations of Wine Service & Sommelier Etiquette
        $wineResource = Resource::where('slug', 'foundations-of-wine-service-and-sommelier-etiquette')->first();
        if ($wineResource) {
            $wineAssessment = Assessment::firstOrCreate(
                ['resource_id' => $wineResource->id],
                [
                    'title' => 'Wine Service & Sommelier Knowledge Check',
                    'description' => 'Covers cork extraction, tasting etiquette, white and red serving temperatures, and glass swirl techniques.',
                    'passing_percentage' => 70,
                    'time_limit_minutes' => 10,
                    'is_published' => true,
                    'created_by' => $admin->id,
                ]
            );

            $this->seedQuestions($wineAssessment, [
                [
                    'question_text' => 'After uncorking a bottle of wine at tableside, what should the sommelier do with the cork?',
                    'options' => [
                        ['key' => 'A', 'text' => 'Place it on a small coaster or to the right of the host\'s glass for inspection'],
                        ['key' => 'B', 'text' => 'Throw it immediately into a floor trash bin'],
                        ['key' => 'C', 'text' => 'Put it in the server\'s apron pocket without showing the guest'],
                        ['key' => 'D', 'text' => 'Smell it loudly in front of all table guests'],
                    ],
                    'correct_answer' => 'A',
                    'points' => 1,
                    'order' => 1,
                    'explanation' => 'Placing the cork on a small saucer allows the host to inspect the cork for dryness, cork rot, or vintage markings.',
                ],
                [
                    'question_text' => 'What is the correct procedure for pouring a tasting sample for the host?',
                    'options' => [
                        ['key' => 'A', 'text' => 'Pour approximately 1 to 2 ounces and wait for the host\'s nod of approval before serving others'],
                        ['key' => 'B', 'text' => 'Fill the host\'s glass to the brim immediately'],
                        ['key' => 'C', 'text' => 'Serve all other guests first, then give the host whatever wine is left'],
                        ['key' => 'D', 'text' => 'The server tastes the wine themselves first from the guest glass'],
                    ],
                    'correct_answer' => 'A',
                    'points' => 1,
                    'order' => 2,
                    'explanation' => 'The host is poured a 1-2 oz sample to evaluate aroma and condition. Once approved, women and guests are served clockwise, and the host last.',
                ],
            ]);
        }

        // Ensure any remaining resources also have an assessment created
        $remaining = Resource::whereDoesntHave('assessment')->get();
        foreach ($remaining as $res) {
            $gen = Assessment::firstOrCreate(
                ['resource_id' => $res->id],
                [
                    'title' => "{$res->title} — Knowledge Check",
                    'description' => "Assess your mastery of the key competencies demonstrated in this learning unit: {$res->title}.",
                    'passing_percentage' => 75,
                    'time_limit_minutes' => 10,
                    'is_published' => true,
                    'created_by' => $admin->id,
                ]
            );

            $this->seedQuestions($gen, [
                [
                    'question_text' => "What is the primary objective of studying {$res->title} in professional F&B operations?",
                    'options' => [
                        ['key' => 'A', 'text' => 'To adhere to industry service benchmarks, safety guidelines, and culinary excellence'],
                        ['key' => 'B', 'text' => 'To bypass standard cleaning procedures and speed up service'],
                        ['key' => 'C', 'text' => 'To memorize brand labels only'],
                        ['key' => 'D', 'text' => 'None of the above'],
                    ],
                    'correct_answer' => 'A',
                    'points' => 1,
                    'order' => 1,
                    'explanation' => 'Adhering to professional standards ensures guest safety, consistency, and institutional excellence.',
                ],
                [
                    'question_text' => 'In standard dining and beverage operations, what should be done immediately upon noticing an equipment or safety defect?',
                    'options' => [
                        ['key' => 'A', 'text' => 'Tag out the equipment, notify the supervisor/instructor, and document the issue'],
                        ['key' => 'B', 'text' => 'Ignore it if service is busy'],
                        ['key' => 'C', 'text' => 'Allow guests to operate the equipment'],
                        ['key' => 'D', 'text' => 'Hide the equipment in the dining area'],
                    ],
                    'correct_answer' => 'A',
                    'points' => 1,
                    'order' => 2,
                    'explanation' => 'Immediate tagging out and reporting prevents workplace accidents and food contamination.',
                ],
            ]);
        }
    }

    /**
     * Helper to seed questions for an assessment.
     *
     * @param  array<int, array<string, mixed>>  $questions
     */
    protected function seedQuestions(Assessment $assessment, array $questions): void
    {
        foreach ($questions as $q) {
            AssessmentQuestion::updateOrCreate(
                [
                    'assessment_id' => $assessment->id,
                    'order' => $q['order'],
                ],
                [
                    'question_text' => $q['question_text'],
                    'question_type' => 'multiple_choice',
                    'options' => $q['options'],
                    'correct_answer' => $q['correct_answer'],
                    'points' => $q['points'] ?? 1,
                    'explanation' => $q['explanation'] ?? null,
                ]
            );
        }
    }
}
