<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ResourceFolder extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'parent_id',
        'name',
        'description',
        'created_by',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(ResourceCategory::class, 'category_id');
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(ResourceFolder::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(ResourceFolder::class, 'parent_id');
    }

    public function resources(): HasMany
    {
        return $this->hasMany(Resource::class, 'folder_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
