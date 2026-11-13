<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('assessments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resource_id')->constrained('resources')->cascadeOnDelete()->unique();
            $table->string('title');
            $table->text('description')->nullable();
            $table->unsignedTinyInteger('passing_percentage')->default(70);
            $table->unsignedSmallInteger('time_limit_minutes')->nullable();
            $table->boolean('is_published')->default(true);
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
        });

        Schema::create('assessment_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('assessment_id')->constrained('assessments')->cascadeOnDelete();
            $table->text('question_text');
            $table->string('question_type')->default('multiple_choice'); // multiple_choice, true_false
            $table->json('options'); // array of ['key' => 'A', 'text' => '...']
            $table->string('correct_answer'); // e.g. 'A' or 'True'
            $table->unsignedSmallInteger('points')->default(1);
            $table->unsignedSmallInteger('order')->default(0);
            $table->text('explanation')->nullable();
            $table->timestamps();

            $table->index(['assessment_id', 'order']);
        });

        Schema::create('assessment_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('assessment_id')->constrained('assessments')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->unsignedSmallInteger('score');
            $table->unsignedSmallInteger('total_points');
            $table->decimal('percentage', 5, 2);
            $table->string('status')->default('passed'); // passed, failed
            $table->json('answers'); // key-value mapping question_id => selected_key
            $table->text('feedback')->nullable();
            $table->timestamp('submitted_at')->useCurrent();
            $table->timestamps();

            $table->index(['assessment_id', 'user_id']);
            $table->index(['user_id', 'status']);
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assessment_submissions');
        Schema::dropIfExists('assessment_questions');
        Schema::dropIfExists('assessments');
    }
};
