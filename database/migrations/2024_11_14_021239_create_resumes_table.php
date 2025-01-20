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
        // Main resumes table
        Schema::create('resumes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            // Profile fields
            $table->string('name');
            $table->string('email');
            $table->string('phone');
            $table->string('address');
            $table->string('image')->nullable();
            // Summary
            $table->text('summary');
            $table->timestamps();
        });

        // Education history
        Schema::create('resume_educations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resume_id')->constrained()->cascadeOnDelete();
            $table->string('school');
            $table->string('education_level');
            $table->date('start_date');
            $table->date('end_date');
            $table->timestamps();
        });

        // Work/Activity experience
        Schema::create('resume_experiences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resume_id')->constrained()->cascadeOnDelete();
            $table->string('activity');
            $table->string('position');
            $table->date('start_date');
            $table->date('end_date');
            $table->timestamps();
        });

        // Certifications
        Schema::create('resume_certifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resume_id')->constrained()->cascadeOnDelete();
            $table->string('certification');
            $table->date('date_of_issue');
            $table->timestamps();
        });

        // Technical skills
        Schema::create('resume_skills', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resume_id')->constrained()->cascadeOnDelete();
            $table->string('skill');
            $table->string('level');
            $table->timestamps();
        });

        // Soft skills
        Schema::create('resume_soft_skills', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resume_id')->constrained()->cascadeOnDelete();
            $table->string('soft_skill');
            $table->string('level')->nullable();
            $table->timestamps();
        });

        // Languages
        Schema::create('resume_languages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resume_id')->constrained()->cascadeOnDelete();
            $table->string('language');
            $table->string('level');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop tables in reverse order to avoid foreign key constraints
        Schema::dropIfExists('resume_languages');
        Schema::dropIfExists('resume_soft_skills');
        Schema::dropIfExists('resume_skills');
        Schema::dropIfExists('resume_certifications');
        Schema::dropIfExists('resume_experiences');
        Schema::dropIfExists('resume_educations');
        Schema::dropIfExists('resumes');
    }
};
