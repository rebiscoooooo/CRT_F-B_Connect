<?php

namespace Tests\Feature;

use App\Mail\StudentAccountApprovedMail;
use App\Mail\StudentOtpVerificationMail;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class StudentRegistrationVerificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_student_registration_sets_pending_status_and_sends_otp(): void
    {
        Mail::fake();

        $response = $this->post('/register', [
            'student_number' => '2024-CRT-9999',
            'first_name' => 'Maria',
            'middle_name' => 'Santos',
            'last_name' => 'Dela Cruz',
            'email' => 'maria@crt.edu.ph',
            'contact_number' => '09123456789',
            'password' => 'secret1234',
            'password_confirmation' => 'secret1234',
            'terms' => true,
        ]);

        $response->assertRedirect(route('verification.otp'));

        $this->assertDatabaseHas('users', [
            'student_number' => '2024-CRT-9999',
            'email' => 'maria@crt.edu.ph',
            'role' => 'student',
            'status' => 'pending',
            'email_verified_at' => null,
        ]);

        $user = User::where('email', 'maria@crt.edu.ph')->first();
        $this->assertNotNull($user->otp_code);
        $this->assertEquals(6, strlen($user->otp_code));
        $this->assertNotNull($user->otp_expires_at);

        Mail::assertSent(StudentOtpVerificationMail::class, function ($mail) use ($user) {
            return $mail->hasTo('maria@crt.edu.ph') && $mail->otp === $user->otp_code;
        });
    }

    public function test_invalid_otp_fails_validation(): void
    {
        $user = User::factory()->create([
            'role' => 'student',
            'status' => 'pending',
            'email_verified_at' => null,
            'otp_code' => '123456',
            'otp_expires_at' => now()->addMinutes(10),
        ]);

        $response = $this->withSession(['pending_user_id' => $user->id])
            ->post('/verify-otp', [
                'code' => '999999',
            ]);

        $response->assertSessionHasErrors('code');
        $this->assertNull($user->fresh()->email_verified_at);
    }

    public function test_valid_otp_verifies_email_and_redirects_to_approval_pending(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'status' => 'active',
        ]);

        $user = User::factory()->create([
            'role' => 'student',
            'status' => 'pending',
            'email_verified_at' => null,
            'otp_code' => '654321',
            'otp_expires_at' => now()->addMinutes(10),
        ]);

        $response = $this->withSession(['pending_user_id' => $user->id])
            ->post('/verify-otp', [
                'code' => '654321',
            ]);

        $response->assertRedirect(route('approval.pending'));

        $user->refresh();
        $this->assertNotNull($user->email_verified_at);
        $this->assertNull($user->otp_code);
        $this->assertNull($user->otp_expires_at);
        $this->assertEquals('pending', $user->status);

        // System notification should be sent to admin
        $this->assertDatabaseHas('system_notifications', [
            'user_id' => $admin->id,
            'title' => 'New Student Awaiting Approval',
        ]);
    }

    public function test_pending_student_cannot_access_dashboard(): void
    {
        $user = User::factory()->create([
            'role' => 'student',
            'status' => 'pending',
            'email_verified_at' => now(),
        ]);

        $response = $this->actingAs($user)->get('/student/dashboard');

        // Middleware logs out pending user and redirects to approval.pending
        $response->assertRedirect(route('approval.pending'));
        $this->assertGuest();
    }

    public function test_admin_can_approve_pending_student(): void
    {
        Mail::fake();

        $admin = User::factory()->create([
            'role' => 'admin',
            'status' => 'active',
        ]);

        $student = User::factory()->create([
            'role' => 'student',
            'status' => 'pending',
            'email_verified_at' => now(),
        ]);

        $response = $this->actingAs($admin)
            ->post(route('admin.students.approve', $student));

        $response->assertSessionHas('success');

        $student->refresh();
        $this->assertEquals('active', $student->status);
        $this->assertEquals($admin->id, $student->approved_by);
        $this->assertNotNull($student->approved_at);

        Mail::assertSent(StudentAccountApprovedMail::class, function ($mail) use ($student) {
            return $mail->hasTo($student->email);
        });

        $this->assertDatabaseHas('system_notifications', [
            'user_id' => $student->id,
            'title' => 'Student Account Approved!',
        ]);
    }

    public function test_admin_can_reject_dummy_student(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'status' => 'active',
        ]);

        $dummyStudent = User::factory()->create([
            'role' => 'student',
            'status' => 'pending',
        ]);

        $response = $this->actingAs($admin)
            ->post(route('admin.students.reject', $dummyStudent));

        $response->assertSessionHas('success');
        $this->assertDatabaseMissing('users', [
            'id' => $dummyStudent->id,
        ]);
    }

    public function test_approved_student_can_login_and_access_dashboard(): void
    {
        $student = User::factory()->create([
            'role' => 'student',
            'status' => 'active',
            'email_verified_at' => now(),
            'password' => Hash::make('password123'),
        ]);

        $response = $this->post('/login', [
            'login' => $student->email,
            'password' => 'password123',
        ]);

        $response->assertRedirect(route('student.dashboard'));
        $this->assertAuthenticatedAs($student);

        $dashResponse = $this->actingAs($student)->get('/student/dashboard');
        $dashResponse->assertOk();
    }
}
