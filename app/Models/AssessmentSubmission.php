<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AssessmentSubmission extends Model
{
    use HasFactory;

    protected $fillable = [
        'assessment_id',
        'user_id',
        'score',
        'total_points',
        'percentage',
        'status',
        'answers',
        'feedback',
        'submitted_at',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'score' => 'integer',
        'total_points' => 'integer',
        'percentage' => 'float',
        'answers' => 'array',
        'submitted_at' => 'datetime',
    ];

    public function assessment(): BelongsTo
    {
        return $this->belongsTo(Assessment::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
