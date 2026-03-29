<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('external_service_prices', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('provider_service_id')->unique();
            $table->string('platform')->nullable();
            $table->string('category')->nullable();
            $table->string('name')->nullable();
            $table->decimal('original_rate', 15, 2)->default(0);
            $table->decimal('sell_rate', 15, 2)->default(0);
            $table->integer('rate_per')->default(1000);
            $table->unsignedBigInteger('min')->nullable();
            $table->unsignedBigInteger('max')->nullable();
            $table->text('desc')->nullable();
            $table->string('status')->default('active');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('external_service_prices');
    }
};