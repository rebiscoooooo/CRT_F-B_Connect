<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\Storage;

class Resource extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'folder_id',
        'title',
        'slug',
        'description',
        'content',
        'resource_type',
        'file_path',
        'thumbnail_path',
        'external_url',
        'visibility',
        'file_size',
        'mime_type',
        'uploaded_by',
        'views_count',
        'downloads_count',
    ];

    protected $appends = [
        'file_url',
        'thumbnail_url',
        'formatted_file_size',
    ];

    public function getFileUrlAttribute(): ?string
    {
        if ($this->file_path && Storage::disk('public')->exists($this->file_path)) {
            return Storage::url($this->file_path);
        }

        return $this->external_url;
    }

    public function getThumbnailUrlAttribute(): ?string
    {
        if ($this->thumbnail_path && Storage::disk('public')->exists($this->thumbnail_path)) {
            return Storage::url($this->thumbnail_path);
        }

        return null;
    }

    public function getFormattedFileSizeAttribute(): string
    {
        if (! $this->file_size) {
            return '—';
        }

        $bytes = $this->file_size;
        $units = ['B', 'KB', 'MB', 'GB'];
        $i = 0;
        while ($bytes >= 1024 && $i < count($units) - 1) {
            $bytes /= 1024;
            $i++;
        }

        return round($bytes, 1).' '.$units[$i];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(ResourceCategory::class, 'category_id');
    }

    public function folder(): BelongsTo
    {
        return $this->belongsTo(ResourceFolder::class, 'folder_id');
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function assessment(): HasOne
    {
        return $this->hasOne(Assessment::class);
    }

    public function assessmentSubmissions(): HasManyThrough
    {
        return $this->hasManyThrough(AssessmentSubmission::class, Assessment::class);
    }
}
