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
   Schema::table('services', function (Blueprint $table) {
    $table->string('platform')->nullable();
    $table->string('group_key')->nullable();
    $table->string('service_key')->nullable();
    $table->string('name')->nullable();
    $table->string('slug')->nullable()->unique();
    $table->text('description')->nullable();
    $table->enum('mode', ['api', 'manual'])->default('manual');
    $table->decimal('price', 15, 2)->default(0);
    $table->unsignedInteger('min_quantity')->nullable();
    $table->unsignedInteger('max_quantity')->nullable();
    $table->string('unit')->nullable();
    $table->boolean('requires_quantity')->default(true);
    $table->boolean('requires_link')->default(true);
    $table->boolean('requires_note')->default(false);
    $table->string('status')->default('active');
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            //
        });
    }
};
