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
        Schema::create('user_prerequisites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_roadmap_id')->constrained('user_roadmaps')->onDelete('cascade');
            $table->foreignId('prerequisites_id')->constrained()->onDelete('cascade');
            $table->enum('status', ['compatible', 'incompatible'])->default('incompatible');
            $table->timestamps();
        });
        Schema::create('user_adaptations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_roadmap_id')->constrained('user_roadmaps')->onDelete('cascade');
            $table->foreignId('adaptation_id')->constrained()->onDelete('cascade');
            $table->enum('status', ['compatible', 'incompatible'])->default('incompatible');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_milestones');
    }
};
