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
        Schema::create('prerequisites_items', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('subject_id')->constrained()->onDelete('cascade');
            $table->string('requirement');
            $table->foreignId('prerequisite_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('adaptations_items', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('persona_id')->constrained()->onDelete('cascade');
            $table->foreignId('adaptation_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prerequisites_items');
        Schema::dropIfExists('adaptations_items');
    }
};
