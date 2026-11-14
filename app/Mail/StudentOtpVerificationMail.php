<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class StudentOtpVerificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public User $user,
        public string $otp
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address(
                config('mail.from.address', 'admin@infinite-limitless.com'),
                config('mail.from.name', 'CRT F&B Connect')
            ),
            subject: "Your CRT F&B Connect Verification Code: {$this->otp}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.student-otp-verification',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}

