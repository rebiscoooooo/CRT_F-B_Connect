<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class StudentAccountApprovedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public User $user,
        public ?User $approver = null
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address(
                config('mail.from.address', 'admin@infinite-limitless.com'),
                config('mail.from.name', 'CRT F&B Connect')
            ),
            subject: 'Account Approved — Welcome to CRT F&B Connect LMS',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.student-account-approved',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}

