<?php

namespace App\Services;

class AssessmentPdfService
{
    protected float $pageWidth = 792.0;  // Letter Landscape width

    protected float $pageHeight = 612.0; // Letter Landscape height

    protected float $marginLeft = 40.0;

    protected float $marginRight = 40.0;

    protected float $contentWidth = 712.0;

    protected array $pages = [];

    protected array $pageStreams = [];

    /**
     * Generate raw binary PDF for assessment submissions.
     */
    public function generate(array $submissions, array $stats, array $filters = [], ?string $generatedBy = 'System Admin'): string
    {
        $rowsPerPageFirst = 14; // First page has KPI boxes
        $rowsPerPageSubsequent = 20;

        $totalSubmissions = count($submissions);

        // Calculate total pages
        if ($totalSubmissions === 0) {
            $totalPages = 1;
        } else {
            $remaining = max(0, $totalSubmissions - $rowsPerPageFirst);
            $totalPages = 1 + (int) ceil($remaining / $rowsPerPageSubsequent);
        }

        $currentIndex = 0;

        for ($page = 1; $page <= $totalPages; $page++) {
            $stream = '';

            // Draw Header
            $stream .= $this->renderHeader($page, $totalPages, $stats, $filters, $generatedBy);

            // Table Header Y position
            $tableTopY = ($page === 1) ? 440.0 : 540.0;

            $stream .= $this->renderTableHeader($tableTopY);

            // Render Rows
            $limit = ($page === 1) ? $rowsPerPageFirst : $rowsPerPageSubsequent;
            $rowHeight = 18.0;
            $currentY = $tableTopY - 22.0;

            if ($totalSubmissions === 0) {
                // Empty state row
                $stream .= "0.98 0.98 0.98 rg {$this->marginLeft} ".($currentY - 14)." {$this->contentWidth} 22 re f\n";
                $stream .= "0.85 0.85 0.85 RG 1 w {$this->marginLeft} ".($currentY - 14)." {$this->contentWidth} 22 re S\n";
                $stream .= '0.4 0.45 0.5 rg BT /F1 10 Tf '.($this->marginLeft + 220).' '.($currentY - 8)." Td (No student assessment records found matching criteria.) Tj ET\n";
            } else {
                $pageRows = array_slice($submissions, $currentIndex, $limit);
                foreach ($pageRows as $rIndex => $sub) {
                    $rowNum = $currentIndex + $rIndex + 1;
                    $stream .= $this->renderRow($sub, $rowNum, $currentY, $rowHeight, $rIndex % 2 === 0);
                    $currentY -= $rowHeight;
                }
                $currentIndex += count($pageRows);
            }

            // Draw Footer
            $stream .= $this->renderFooter($page, $totalPages);

            $this->pageStreams[] = $stream;
        }

        return $this->buildPdfBinary();
    }

    protected function renderHeader(int $page, int $totalPages, array $stats, array $filters, ?string $generatedBy): string
    {
        $s = '';

        if ($page === 1) {
            // Navy top decorative bar
            $s .= "0.12 0.24 0.54 rg {$this->marginLeft} 585 {$this->contentWidth} 5 re f\n";

            // Title block
            $s .= "0.08 0.16 0.36 rg BT /F2 15 Tf {$this->marginLeft} 565 Td (COLLEGE OF RESEARCH AND TECHNOLOGY) Tj ET\n";
            $s .= "0.15 0.35 0.75 rg BT /F2 11 Tf {$this->marginLeft} 550 Td (CRT F&B Connect - Student Assessment & Examination Report) Tj ET\n";
            $s .= "0.45 0.5 0.58 rg BT /F1 8.5 Tf {$this->marginLeft} 537 Td (Official LMS Academic Competency Evaluation Log | Confidential) Tj ET\n";

            // Metadata on right
            $dateStr = date('M d, Y h:i A');
            $s .= '0.45 0.5 0.58 rg BT /F1 8.5 Tf 520 565 Td (Generated: '.$this->escapeText($dateStr).") Tj ET\n";
            $s .= '0.45 0.5 0.58 rg BT /F1 8.5 Tf 520 552 Td (Officer: '.$this->escapeText($generatedBy ?? 'Admin').") Tj ET\n";

            $scopeStr = ! empty($filters['resource_id']) ? 'Filter: Specific Lesson' : 'Scope: All Modules';
            if (! empty($filters['status'])) {
                $scopeStr .= ' ('.strtoupper($filters['status']).')';
            }
            $s .= '0.15 0.35 0.75 rg BT /F2 8.5 Tf 520 539 Td ('.$this->escapeText($scopeStr).") Tj ET\n";

            // Divider line
            $s .= "0.85 0.88 0.92 RG 1 w {$this->marginLeft} 528 752 528 m S\n";

            // KPI Summary Cards
            // Box 1: Total Submissions
            $s .= $this->renderKpiBox(40, 470, 165, 45, 'TOTAL ATTEMPTS', (string) ($stats['total_submissions'] ?? 0), '0.15 0.35 0.75');
            // Box 2: Passed
            $passedRate = ($stats['total_submissions'] ?? 0) > 0 ? round((($stats['passed_count'] ?? 0) / $stats['total_submissions']) * 100, 1) : 0;
            $s .= $this->renderKpiBox(222, 470, 165, 45, 'PASSED EXAMS', ($stats['passed_count'] ?? 0)." ({$passedRate}%)", '0.05 0.55 0.25');
            // Box 3: Failed
            $s .= $this->renderKpiBox(404, 470, 165, 45, 'FAILED ATTEMPTS', (string) ($stats['failed_count'] ?? 0), '0.85 0.15 0.15');
            // Box 4: Average Score
            $s .= $this->renderKpiBox(586, 470, 166, 45, 'AVERAGE SCORE', ($stats['average_score'] ?? 0).'%', '0.45 0.2 0.75');

        } else {
            // Running compact header on page 2+
            $s .= "0.12 0.24 0.54 rg {$this->marginLeft} 588 {$this->contentWidth} 3 re f\n";
            $s .= "0.15 0.35 0.75 rg BT /F2 9.5 Tf {$this->marginLeft} 572 Td (COLLEGE OF RESEARCH AND TECHNOLOGY - Student Assessments Record) Tj ET\n";
            $s .= "0.5 0.55 0.6 rg BT /F1 8.5 Tf 630 572 Td (Page {$page} of {$totalPages}) Tj ET\n";
            $s .= "0.88 0.9 0.94 RG 0.5 w {$this->marginLeft} 564 752 564 m S\n";
        }

        return $s;
    }

    protected function renderKpiBox(float $x, float $y, float $w, float $h, string $label, string $val, string $colorRgb): string
    {
        $s = '';
        // Background
        $s .= "0.96 0.97 0.99 rg {$x} {$y} {$w} {$h} re f\n";
        // Border
        $s .= "0.85 0.88 0.92 RG 1 w {$x} {$y} {$w} {$h} re S\n";
        // Left accent stripe
        $s .= "{$colorRgb} rg {$x} {$y} 3.5 {$h} re f\n";
        // Label
        $s .= '0.45 0.5 0.58 rg BT /F2 7.5 Tf '.($x + 10).' '.($y + 28).' Td ('.$this->escapeText($label).") Tj ET\n";
        // Value
        $s .= '0.1 0.15 0.25 rg BT /F2 13 Tf '.($x + 10).' '.($y + 11).' Td ('.$this->escapeText($val).") Tj ET\n";

        return $s;
    }

    protected function renderTableHeader(float $y): string
    {
        $h = 20.0;
        $s = '';
        // Header background - Dark Navy
        $s .= "0.12 0.22 0.45 rg {$this->marginLeft} {$y} {$this->contentWidth} {$h} re f\n";

        // Column Titles
        $cols = [
            ['title' => '#', 'x' => 45, 'w' => 25],
            ['title' => 'STUDENT ID', 'x' => 70, 'w' => 75],
            ['title' => 'STUDENT NAME', 'x' => 145, 'w' => 140],
            ['title' => 'LESSON / MODULE', 'x' => 285, 'w' => 200],
            ['title' => 'SCORE', 'x' => 485, 'w' => 50],
            ['title' => 'GRADE', 'x' => 535, 'w' => 50],
            ['title' => 'STATUS', 'x' => 585, 'w' => 65],
            ['title' => 'SUBMITTED AT', 'x' => 650, 'w' => 95],
        ];

        $s .= "1 1 1 rg BT /F2 8 Tf\n";
        foreach ($cols as $c) {
            $s .= "{$c['x']} ".($y + 6).' Td ('.$this->escapeText($c['title']).") Tj\n";
            $s .= "-{$c['x']} -".($y + 6)." Td\n"; // reset pos
        }
        $s .= "ET\n";

        return $s;
    }

    protected function renderRow(array $sub, int $num, float $y, float $height, bool $isEven): string
    {
        $s = '';
        // Background
        if ($isEven) {
            $s .= "0.98 0.99 1.0 rg {$this->marginLeft} {$y} {$this->contentWidth} {$height} re f\n";
        } else {
            $s .= "1.0 1.0 1.0 rg {$this->marginLeft} {$y} {$this->contentWidth} {$height} re f\n";
        }
        // Bottom border line
        $s .= "0.9 0.92 0.95 RG 0.5 w {$this->marginLeft} {$y} 752 {$y} m S\n";

        // Row text
        $studentNum = $sub['student_number'] ?? 'N/A';
        $studentName = $this->truncateText($sub['student_name'] ?? 'Student', 24);
        $lessonTitle = $this->truncateText($sub['lesson_title'] ?? 'Lesson Quiz', 36);
        $scoreText = ($sub['score'] ?? 0).'/'.($sub['total_points'] ?? 10);
        $pctText = number_format((float) ($sub['percentage'] ?? 0), 1).'%';
        $status = strtoupper($sub['status'] ?? 'PENDING');
        $dateText = ! empty($sub['submitted_at']) ? date('M d, Y h:i A', strtotime($sub['submitted_at'])) : '-';

        // Base text
        $s .= "0.2 0.25 0.35 rg BT /F1 8 Tf\n";
        $s .= '45 '.($y + 5)." Td ({$num}) Tj -45 -".($y + 5)." Td\n";
        $s .= '70 '.($y + 5).' Td ('.$this->escapeText($studentNum).') Tj -70 -'.($y + 5)." Td\n";
        $s .= "ET\n";

        // Student name bold
        $s .= "0.1 0.15 0.25 rg BT /F2 8 Tf\n";
        $s .= '145 '.($y + 5).' Td ('.$this->escapeText($studentName).') Tj -145 -'.($y + 5)." Td\n";
        $s .= "ET\n";

        // Lesson Title
        $s .= "0.2 0.25 0.35 rg BT /F1 8 Tf\n";
        $s .= '285 '.($y + 5).' Td ('.$this->escapeText($lessonTitle).') Tj -285 -'.($y + 5)." Td\n";
        $s .= '485 '.($y + 5).' Td ('.$this->escapeText($scoreText).') Tj -485 -'.($y + 5)." Td\n";
        $s .= '535 '.($y + 5).' Td ('.$this->escapeText($pctText).') Tj -535 -'.($y + 5)." Td\n";
        $s .= '650 '.($y + 5).' Td ('.$this->escapeText($dateText).') Tj -650 -'.($y + 5)." Td\n";
        $s .= "ET\n";

        // Status Badge Pill
        $isPassed = ($status === 'PASSED');
        if ($isPassed) {
            $s .= '0.85 0.96 0.88 rg 585 '.($y + 3)." 52 12 re f\n"; // light green pill
            $s .= '0.15 0.55 0.25 rg BT /F2 7.5 Tf 593 '.($y + 5.5).' Td (PASSED) Tj -593 -'.($y + 5.5)." Td ET\n";
        } else {
            $s .= '0.99 0.88 0.88 rg 585 '.($y + 3)." 52 12 re f\n"; // light red pill
            $s .= '0.8 0.15 0.15 rg BT /F2 7.5 Tf 596 '.($y + 5.5).' Td (FAILED) Tj -596 -'.($y + 5.5)." Td ET\n";
        }

        return $s;
    }

    protected function renderFooter(int $page, int $totalPages): string
    {
        $s = '';
        $s .= "0.85 0.88 0.92 RG 1 w {$this->marginLeft} 35 752 35 m S\n";
        $s .= "0.5 0.55 0.6 rg BT /F1 7.5 Tf {$this->marginLeft} 24 Td (CRT F&B Connect LMS - Confidential Student Evaluation Record | College of Research and Technology) Tj ET\n";
        $s .= "0.4 0.45 0.5 rg BT /F2 7.5 Tf 680 24 Td (Page {$page} of {$totalPages}) Tj ET\n";

        return $s;
    }

    protected function truncateText(string $text, int $max): string
    {
        if (mb_strlen($text) <= $max) {
            return $text;
        }

        return mb_substr($text, 0, $max - 3).'...';
    }

    protected function escapeText(string $text): string
    {
        // Replace non-ASCII or unsupported characters
        $text = iconv('UTF-8', 'Windows-1252//TRANSLIT', $text) ?: $text;
        $text = str_replace(['\\', '(', ')'], ['\\\\', '\\(', '\\)'], $text);

        return $text;
    }

    protected function buildPdfBinary(): string
    {
        $pdf = "%PDF-1.4\n%\xe2\xe3\xcf\xd3\n";
        $offsets = [];
        $objIndex = 1;

        // 1: Catalog
        $offsets[1] = strlen($pdf);
        $pdf .= "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n";

        // Font F1: Helvetica
        $offsets[3] = strlen($pdf);
        $pdf .= "3 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>\nendobj\n";

        // Font F2: Helvetica-Bold
        $offsets[4] = strlen($pdf);
        $pdf .= "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>\nendobj\n";

        $pageCount = count($this->pageStreams);
        $pageObjIds = [];
        $nextObjId = 5;

        // Allocate obj IDs for pages and content streams
        for ($i = 0; $i < $pageCount; $i++) {
            $pageObjId = $nextObjId++;
            $streamObjId = $nextObjId++;
            $pageObjIds[] = ['page' => $pageObjId, 'stream' => $streamObjId];
        }

        // 2: Pages
        $offsets[2] = strlen($pdf);
        $kidsStr = implode(' 0 R ', array_column($pageObjIds, 'page')).' 0 R';
        $pdf .= "2 0 obj\n<< /Type /Pages /Kids [{$kidsStr}] /Count {$pageCount} >>\nendobj\n";

        // Generate each Page and Stream
        foreach ($pageObjIds as $idx => $ids) {
            $streamContent = $this->pageStreams[$idx];
            $streamLen = strlen($streamContent);

            // Stream obj
            $offsets[$ids['stream']] = strlen($pdf);
            $pdf .= "{$ids['stream']} 0 obj\n<< /Length {$streamLen} >>\nstream\n{$streamContent}\nendstream\nendobj\n";

            // Page obj
            $offsets[$ids['page']] = strlen($pdf);
            $pdf .= "{$ids['page']} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 {$this->pageWidth} {$this->pageHeight}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents {$ids['stream']} 0 R >>\nendobj\n";
        }

        $totalObjs = $nextObjId;
        $xrefOff = strlen($pdf);
        $pdf .= "xref\n0 {$totalObjs}\n";
        $pdf .= "0000000000 65535 f \n";

        for ($i = 1; $i < $totalObjs; $i++) {
            $off = $offsets[$i] ?? 0;
            $pdf .= sprintf("%010d 00000 n \n", $off);
        }

        $pdf .= "trailer\n<< /Size {$totalObjs} /Root 1 0 R >>\nstartxref\n{$xrefOff}\n%%EOF";

        return $pdf;
    }
}
