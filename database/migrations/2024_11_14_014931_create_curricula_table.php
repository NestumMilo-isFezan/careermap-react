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
        Schema::create('curriculums', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('description')->nullable();
            $table->foreignId('student_id')->constrained()->onDelete('cascade');
            $table->string('document')->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->enum('level', ['school', 'district', 'state', 'national', 'international'])->default('school');
            $table->enum('type', ['certificates', 'activities'])->default('certificates');
            $table->timestamps();
        });

        Schema::create('softskills', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('description')->nullable();
            $table->timestamps();
        });

        Schema::create('student_softskills', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('curriculum_points', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_softskill_id')->constrained('student_softskills')->onDelete('cascade');
            $table->foreignId('curriculum_id')->constrained('curriculums')->onDelete('cascade');
            $table->foreignId('softskill_id')->constrained()->onDelete('cascade');
            $table->integer('score')->default(0);
            $table->timestamps();
        });


    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('curriculum_points');
        Schema::dropIfExists('student_softskills');
        Schema::dropIfExists('softskills');
        Schema::dropIfExists('curriculums');
    }
};
