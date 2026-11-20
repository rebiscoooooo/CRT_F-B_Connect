<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class StaffAccountRegisteredMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public User $user,
        public string $plainPassword,
        public ?User $creator = null
    ) {}

    public function envelope(): Envelope
    {
        $roleTitle = $this->user->role === 'admin' ? 'Administrator' : 'Instructor / Faculty';

        return new Envelope(
            from: new Address(
                config('mail.from.address', 'admin@infinite-limitless.com'),
                config('mail.from.name', 'CRT F&B Connect')
            ),
            subject: "Your {$roleTitle} Account Credentials — CRT F&B Connect LMS",
        );
    }

    public function content(): Content
    {
        $roleTitle = $this->user->role === 'admin' ? 'Administrator' : 'Instructor / Faculty';

        return new Content(
            view: 'emails.staff-account-registered',
            with: [
                'roleTitle' => $roleTitle,
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
