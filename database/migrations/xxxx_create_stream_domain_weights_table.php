<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stream_domain_weights', function (Blueprint $table) {
            $table->id();
            $table->foreignId('stream_id')->constrained('streams')->onDelete('cascade')->nullable();
            $table->foreignId('domain_id')->constrained('domains')->onDelete('cascade')->nullable();
            $table->decimal('weight', 8, 2);
            $table->timestamps();

            $table->unique(['stream_id', 'domain_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stream_domain_weights');
    }
};
