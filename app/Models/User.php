<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'student_number',
        'first_name',
        'middle_name',
        'last_name',
        'name',
        'email',
        'email_verified_at',
        'contact_number',
        'password',
        'otp_code',
        'otp_expires_at',
        'profile_picture',
        'role',
        'status',
        'approved_by',
        'approved_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'otp_code',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var list<string>
     */
    protected $appends = [
        'avatar_url',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'otp_expires_at' => 'datetime',
            'approved_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function isAdmin(): bool
    {
        return in_array($this->role, ['admin', 'teacher'], true);
    }

    public function isStudent(): bool
    {
        return $this->role === 'student';
    }

    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function isInactive(): bool
    {
        return $this->status === 'inactive';
    }

    public function isPendingApproval(): bool
    {
        return $this->isStudent() && $this->status === 'pending' && $this->email_verified_at !== null;
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(self::class, 'approved_by');
    }

    public function getAvatarUrlAttribute(): string
    {
        if ($this->profile_picture && Storage::disk('public')->exists($this->profile_picture)) {
            return Storage::url($this->profile_picture);
        }

        $name = urlencode($this->name ?: ($this->first_name.' '.$this->last_name));

        return "https://ui-avatars.com/api/?name={$name}&background=2563EB&color=ffffff&bold=true";
    }

    public function resources(): HasMany
    {
        return $this->hasMany(Resource::class, 'uploaded_by');
    }

    public function folders(): HasMany
    {
        return $this->hasMany(ResourceFolder::class, 'created_by');
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(SystemNotification::class);
    }

    public function activityLogs(): HasMany
    {
        return $this->hasMany(ActivityLog::class);
    }

    public function assessmentSubmissions(): HasMany
    {
        return $this->hasMany(AssessmentSubmission::class);
    }
}
