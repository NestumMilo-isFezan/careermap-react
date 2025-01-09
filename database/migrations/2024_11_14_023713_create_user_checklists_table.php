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
        Schema::create('user_prerequisites_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_prerequisite_id')->constrained('user_prerequisites')->onDelete('cascade');
            $table->foreignId('prerequisites_item_id')->constrained()->onDelete('cascade');
            $table->enum('status', ['unchecked', 'checked'])->default('unchecked');
            $table->date('completion_date')->nullable();
            $table->timestamps();
        });
        Schema::create('user_adaptations_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_adaptation_id')->constrained('user_adaptations')->onDelete('cascade');
            $table->foreignId('adaptations_item_id')->constrained()->onDelete('cascade');
            $table->enum('status', ['unchecked', 'checked'])->default('unchecked');
            $table->date('completion_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_checklists');
    }
};
