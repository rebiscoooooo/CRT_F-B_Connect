<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Assessment extends Model
{
    use HasFactory;

    protected $fillable = [
        'resource_id',
        'title',
        'description',
        'passing_percentage',
        'time_limit_minutes',
        'is_published',
        'created_by',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'passing_percentage' => 'integer',
        'time_limit_minutes' => 'integer',
        'is_published' => 'boolean',
    ];

    public function resource(): BelongsTo
    {
        return $this->belongsTo(Resource::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function questions(): HasMany
    {
        return $this->hasMany(AssessmentQuestion::class)->orderBy('order', 'asc');
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(AssessmentSubmission::class);
    }

    public function getTotalPointsAttribute(): int
    {
        return (int) $this->questions()->sum('points');
    }
}
