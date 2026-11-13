<?php

namespace Database\Seeders;

use App\Models\ActivityLog;
use App\Models\Resource;
use App\Models\ResourceCategory;
use App\Models\ResourceFolder;
use App\Models\SystemNotification;
use App\Models\SystemSetting;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Settings
        SystemSetting::set('site_name', 'CRT F&B Connect');
        SystemSetting::set('institution', 'College of Research & Technology');
        SystemSetting::set('department_name', 'Food & Beverage Services Management');
        SystemSetting::set('contact_email', 'fnb.support@crt.edu.ph');
        SystemSetting::set('contact_phone', '+63 (044) 463-0000');
        SystemSetting::set('allow_registration', '1');
        SystemSetting::set('system_announcement', 'Welcome to the First Semester of A.Y. 2026-2027. All students are required to review the TESDA NC II Core Competencies and Dining Room Safety modules.');

        // 2. Administrators & Teachers
        $admin = User::firstOrCreate(
            ['email' => 'admin@crt.edu.ph'],
            [
                'student_number' => null,
                'first_name' => 'Maria',
                'middle_name' => 'Elena',
                'last_name' => 'Santos',
                'name' => 'Chef Maria Santos',
                'contact_number' => '+63 918 555 1001',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );

        $teacher = User::firstOrCreate(
            ['email' => 'teacher@crt.edu.ph'],
            [
                'student_number' => null,
                'first_name' => 'Antonio',
                'middle_name' => 'Luis',
                'last_name' => 'Reyes',
                'name' => 'Chef Antonio Reyes',
                'contact_number' => '+63 919 555 1002',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );

        // 3. Students
        $student1 = User::firstOrCreate(
            ['email' => 'student@crt.edu.ph'],
            [
                'student_number' => '2024-CRT-0101',
                'first_name' => 'Juan Carlos',
                'middle_name' => 'Velasco',
                'last_name' => 'Dela Cruz',
                'name' => 'Juan Carlos Dela Cruz',
                'contact_number' => '+63 917 123 4567',
                'password' => Hash::make('password'),
                'role' => 'student',
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );

        $student2 = User::firstOrCreate(
            ['email' => 'angela.bautista@crt.edu.ph'],
            [
                'student_number' => '2024-CRT-0102',
                'first_name' => 'Angela Marie',
                'middle_name' => 'Santos',
                'last_name' => 'Bautista',
                'name' => 'Angela Marie Bautista',
                'contact_number' => '+63 920 334 8872',
                'password' => Hash::make('password'),
                'role' => 'student',
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );

        $student3 = User::firstOrCreate(
            ['email' => 'mark.tan@crt.edu.ph'],
            [
                'student_number' => '2024-CRT-0103',
                'first_name' => 'Mark Joseph',
                'middle_name' => 'Perez',
                'last_name' => 'Tan',
                'name' => 'Mark Joseph Tan',
                'contact_number' => '+63 922 884 1993',
                'password' => Hash::make('password'),
                'role' => 'student',
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );

        $student4 = User::firstOrCreate(
            ['email' => 'princess.ramos@crt.edu.ph'],
            [
                'student_number' => '2024-CRT-0104',
                'first_name' => 'Princess Nicole',
                'middle_name' => 'David',
                'last_name' => 'Ramos',
                'name' => 'Princess Nicole Ramos',
                'contact_number' => '+63 915 994 0012',
                'password' => Hash::make('password'),
                'role' => 'student',
                'status' => 'inactive',
                'email_verified_at' => now(),
            ]
        );

        // 4. Categories
        $categoriesData = [
            [
                'name' => 'Video Lessons',
                'slug' => 'video-lessons',
                'description' => 'Comprehensive culinary, bar service, and dining room video demonstrations.',
                'icon' => 'Video',
            ],
            [
                'name' => 'Illustrations',
                'slug' => 'illustrations',
                'description' => 'High-resolution visual diagrams, table cover layouts, and culinary infographics.',
                'icon' => 'Image',
            ],
            [
                'name' => 'PDF Modules',
                'slug' => 'pdf-modules',
                'description' => 'Official curriculum syllabi, standard operating procedures, and course modules.',
                'icon' => 'FileText',
            ],
            [
                'name' => 'Text Lessons',
                'slug' => 'text-lessons',
                'description' => 'In-depth reading materials, hospitality theories, and service protocol guides.',
                'icon' => 'BookOpen',
            ],
            [
                'name' => 'Other Learning Materials',
                'slug' => 'other-materials',
                'description' => 'Assessment rubrics, checklists, audio references, and practical templates.',
                'icon' => 'Folder',
            ],
        ];

        $categories = [];
        foreach ($categoriesData as $cat) {
            $categories[$cat['slug']] = ResourceCategory::firstOrCreate(
                ['slug' => $cat['slug']],
                $cat
            );
        }

        // 5. Folders
        $vFolder1 = ResourceFolder::firstOrCreate([
            'category_id' => $categories['video-lessons']->id,
            'name' => 'Barista & Beverage Crafting Masterclass',
        ], [
            'description' => 'Coffee extraction, espresso drinks calibration, latte art, and mocktail mixology.',
            'created_by' => $admin->id,
        ]);

        $vFolder2 = ResourceFolder::firstOrCreate([
            'category_id' => $categories['video-lessons']->id,
            'name' => 'Fine Dining Table Service & Banquet Etiquette',
        ], [
            'description' => 'Classical European, American, and banquet style plate and silver service techniques.',
            'created_by' => $admin->id,
        ]);

        $iFolder1 = ResourceFolder::firstOrCreate([
            'category_id' => $categories['illustrations']->id,
            'name' => 'Cutlery & Table Settings Diagrams',
        ], [
            'description' => 'Schematic illustrations showing exact distances and positions of flatware and crystal.',
            'created_by' => $teacher->id,
        ]);

        $iFolder2 = ResourceFolder::firstOrCreate([
            'category_id' => $categories['illustrations']->id,
            'name' => 'Glassware & Bar Service Anatomy',
        ], [
            'description' => 'Visual reference cards for stems, tumblers, shakers, and bar service accoutrements.',
            'created_by' => $teacher->id,
        ]);

        $pdfFolder1 = ResourceFolder::firstOrCreate([
            'category_id' => $categories['pdf-modules']->id,
            'name' => 'TESDA NC II Food and Beverage Services Modules',
        ], [
            'description' => 'Core competency curriculum guidelines and standardized institutional learning packs.',
            'created_by' => $admin->id,
        ]);

        $pdfFolder2 = ResourceFolder::firstOrCreate([
            'category_id' => $categories['pdf-modules']->id,
            'name' => 'HACCP Safety & Kitchen Sanitization Manuals',
        ], [
            'description' => 'Sanitary standards, danger zone thresholds, personal hygiene, and safety checklists.',
            'created_by' => $admin->id,
        ]);

        $textFolder1 = ResourceFolder::firstOrCreate([
            'category_id' => $categories['text-lessons']->id,
            'name' => 'Wine Knowledge & Pairing Foundations',
        ], [
            'description' => 'Grape varieties, vintage storage, decanting etiquette, and sommelier terminology.',
            'created_by' => $teacher->id,
        ]);

        $otherFolder1 = ResourceFolder::firstOrCreate([
            'category_id' => $categories['other-materials']->id,
            'name' => 'Assessment Rubrics & Practical Exam Checklists',
        ], [
            'description' => 'Official grading rubrics for student return demonstrations and skill certifications.',
            'created_by' => $admin->id,
        ]);

        // 6. Resources
        // Video Lesson 1
        Resource::firstOrCreate([
            'slug' => 'espresso-extraction-and-milk-steaming',
        ], [
            'category_id' => $categories['video-lessons']->id,
            'folder_id' => $vFolder1->id,
            'title' => 'Espresso Extraction & Milk Steaming Technique',
            'description' => 'Learn the golden ratio of espresso extraction, grind size calibration, tamping pressure, and microfoam milk texturing for specialty coffee drinks.',
            'resource_type' => 'video',
            'external_url' => 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            'visibility' => 'published',
            'file_size' => 15800000,
            'mime_type' => 'video/mp4',
            'uploaded_by' => $admin->id,
            'views_count' => 124,
            'downloads_count' => 18,
        ]);

        // Video Lesson 2
        Resource::firstOrCreate([
            'slug' => 'formal-table-setup-and-service-walkthrough',
        ], [
            'category_id' => $categories['video-lessons']->id,
            'folder_id' => $vFolder2->id,
            'title' => 'Formal Table Setup & Service Walkthrough',
            'description' => 'Step-by-step masterclass demonstrating silver service, show plate placement, wine service protocol, and clearing from the right side.',
            'resource_type' => 'video',
            'external_url' => 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            'visibility' => 'published',
            'file_size' => 24500000,
            'mime_type' => 'video/mp4',
            'uploaded_by' => $teacher->id,
            'views_count' => 89,
            'downloads_count' => 12,
        ]);

        // Illustration 1
        Resource::firstOrCreate([
            'slug' => 'formal-dinner-table-cover-diagram',
        ], [
            'category_id' => $categories['illustrations']->id,
            'folder_id' => $iFolder1->id,
            'title' => 'Formal 5-Course Dinner Table Cover Diagram',
            'description' => 'Detailed technical diagram showing exact positioning of salad fork, dinner fork, soup spoon, dinner knife, and three-glass beverage triangle.',
            'resource_type' => 'illustration',
            'file_path' => 'samples/table_setting_diagram.svg',
            'visibility' => 'published',
            'file_size' => 4060,
            'mime_type' => 'image/svg+xml',
            'uploaded_by' => $teacher->id,
            'views_count' => 210,
            'downloads_count' => 64,
        ]);

        // Illustration 2
        Resource::firstOrCreate([
            'slug' => 'banquet-napkin-folding-diagrams',
        ], [
            'category_id' => $categories['illustrations']->id,
            'folder_id' => $iFolder1->id,
            'title' => 'Banquet Napkin Folding Reference Chart',
            'description' => 'Visual reference steps for standard napkin shapes: The Bishop\'s Hat, Pyramid, French Fleur-de-lis, and Crown.',
            'resource_type' => 'illustration',
            'file_path' => 'samples/table_setting_diagram.svg',
            'visibility' => 'published',
            'file_size' => 4060,
            'mime_type' => 'image/svg+xml',
            'uploaded_by' => $teacher->id,
            'views_count' => 145,
            'downloads_count' => 38,
        ]);

        // PDF Module 1
        Resource::firstOrCreate([
            'slug' => 'tesda-nc-ii-core-module-1-prepare-dining-room',
        ], [
            'category_id' => $categories['pdf-modules']->id,
            'folder_id' => $pdfFolder1->id,
            'title' => 'TESDA NC II Core Module 1: Prepare the Dining Room / Restaurant Area for Service',
            'description' => 'Covers checking dining room environment, taking reservations, setting tables according to standard, and preparing service stations (gueridon & side stand).',
            'resource_type' => 'pdf',
            'file_path' => 'samples/fnb_nc2_module.pdf',
            'visibility' => 'published',
            'file_size' => 946,
            'mime_type' => 'application/pdf',
            'uploaded_by' => $admin->id,
            'views_count' => 312,
            'downloads_count' => 152,
        ]);

        // PDF Module 2
        Resource::firstOrCreate([
            'slug' => 'haccp-sanitation-and-food-hygiene-manual',
        ], [
            'category_id' => $categories['pdf-modules']->id,
            'folder_id' => $pdfFolder2->id,
            'title' => 'HACCP Food Safety, Personal Hygiene & Sanitization Standards',
            'description' => 'Critical control points in banquet food holding, sanitizing glassware and flatware, 3-sink washing procedures, and temperature danger zones.',
            'resource_type' => 'pdf',
            'file_path' => 'samples/fnb_nc2_module.pdf',
            'visibility' => 'published',
            'file_size' => 946,
            'mime_type' => 'application/pdf',
            'uploaded_by' => $admin->id,
            'views_count' => 184,
            'downloads_count' => 77,
        ]);

        // Text Lesson 1
        Resource::firstOrCreate([
            'slug' => 'foundations-of-wine-service-and-sommelier-etiquette',
        ], [
            'category_id' => $categories['text-lessons']->id,
            'folder_id' => $textFolder1->id,
            'title' => 'Foundations of Wine Service & Sommelier Etiquette',
            'description' => 'A comprehensive instructional guide on presenting wine bottles to the host, proper bottle opening with a waiter\'s corkscrew, and tasting etiquette.',
            'resource_type' => 'text',
            'content' => "## 1. PRESENTING THE WINE TO THE HOST\n\nWhen presenting wine, approach the host from their right side. Hold the bottle on a folded service napkin with the label facing the host directly. State the winery, grape variety, region, and vintage clearly:\n\n> *\"Good evening, sir. Here is your 2021 Cabernet Sauvignon from Napa Valley, California.\"*\n\nWait for the host's nod of approval before proceeding to uncork.\n\n---\n\n## 2. UNCORKING PROCEDURE\n\n1. **Cut the Foil:** Use the foil-cutter blade of your sommelier knife to slice cleanly below the second lip of the bottle neck to prevent wine from contacting the metal.\n2. **Insert the Worm:** Center the spiral worm in the cork and twist clockwise until one spiral remains visible.\n3. **Leverage the First Step:** Engage the first bootlever notch onto the bottle rim and pull upward steadily.\n4. **Extract Quietly:** Ease the cork out by hand with a soft twist to avoid a loud \"pop\".\n5. **Inspect the Cork:** Check that the cork is intact and not dried or vinegar-scented. Place the cork beside the host's glassware if requested.\n\n---\n\n## 3. POURING & TASTING PROTOCOL\n\n- Pour approximately 1 to 2 ounces into the host's glass for tasting.\n- Allow the host to swirl, sniff, and taste.\n- Once approved, serve the other guests clockwise around the table, beginning with female guests, then gentlemen, and finally topping up the host's glass.\n- Always twist the bottle slightly over the glass and catch any stray droplet with your clean service napkin.",
            'visibility' => 'published',
            'file_size' => 2048,
            'mime_type' => 'text/plain',
            'uploaded_by' => $teacher->id,
            'views_count' => 95,
            'downloads_count' => 22,
        ]);

        // Other Learning Material
        Resource::firstOrCreate([
            'slug' => 'fnb-nc-ii-institutional-assessment-rubric',
        ], [
            'category_id' => $categories['other-materials']->id,
            'folder_id' => $otherFolder1->id,
            'title' => 'F&B NC II Institutional Assessment Rubric & Practical Checklist',
            'description' => 'Official 100-point performance grading rubric covering Grooming, Station Preparation, Order Taking, Food Service, and Dining Area Cleaning.',
            'resource_type' => 'other',
            'file_path' => 'samples/culinary_guidelines.txt',
            'visibility' => 'published',
            'file_size' => 1247,
            'mime_type' => 'text/plain',
            'uploaded_by' => $admin->id,
            'views_count' => 240,
            'downloads_count' => 110,
        ]);

        // 7. Activity Logs
        ActivityLog::record('created', 'Uploaded resource "Formal 5-Course Dinner Table Cover Diagram"', $teacher->id, Resource::class, 3);
        ActivityLog::record('created', 'Published new video lesson "Espresso Extraction & Milk Steaming Technique"', $admin->id, Resource::class, 1);
        ActivityLog::record('created', 'Enrolled student Juan Carlos Dela Cruz (2024-CRT-0101)', $admin->id, User::class, $student1->id);
        ActivityLog::record('updated', 'Updated system announcement and department parameters', $admin->id, SystemSetting::class, 1);

        // 8. Notifications
        SystemNotification::create([
            'user_id' => $student1->id,
            'title' => 'New Educational Resource Available',
            'message' => 'Chef Maria Santos uploaded "TESDA NC II Core Module 1: Prepare the Dining Room". Please review it before Friday.',
            'type' => 'resource',
            'link' => '/student/resources',
            'created_at' => now()->subHours(3),
        ]);

        SystemNotification::create([
            'user_id' => $student1->id,
            'title' => 'Welcome to CRT F&B Connect!',
            'message' => 'Your student account is now active. Explore the library of video masterclasses and module downloads.',
            'type' => 'account',
            'link' => '/student/dashboard',
            'read_at' => now()->subHour(1),
            'created_at' => now()->subDay(1),
        ]);

        SystemNotification::create([
            'user_id' => $admin->id,
            'title' => 'New Student Registration',
            'message' => 'Student Juan Carlos Dela Cruz (2024-CRT-0101) completed profile setup.',
            'type' => 'account',
            'link' => '/admin/students',
            'created_at' => now()->subHours(2),
        ]);

        $this->call(AssessmentSeeder::class);
    }
}
