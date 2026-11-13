<?php

namespace App\Mail;

use App\Models\Resource;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ResourceAnnouncementMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public Resource $resource,
        public User $student,
        public ?string $announcementMessage = null,
        public ?User $instructor = null
    ) {
        //
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "New Learning Material: {$this->resource->title} — CRT F&B Connect",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.resource-announcement',
            with: [
                'resource' => $this->resource,
                'student' => $this->student,
                'announcementMessage' => $this->announcementMessage,
                'instructor' => $this->instructor,
                'resourceUrl' => url("/student/resources/{$this->resource->id}"),
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
