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
       Schema::create('orders', function (Blueprint $table) {
    $table->id();

    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->foreignId('service_id')->constrained()->cascadeOnDelete();

    $table->string('service_name');
    $table->string('platform')->nullable();

    $table->enum('mode', ['api', 'manual']);

    $table->string('target_link')->nullable();
    $table->integer('quantity')->nullable();

    $table->decimal('unit_price', 15, 2)->default(0);
    $table->decimal('total_price', 15, 2)->default(0);

    $table->text('note')->nullable();

    $table->string('status')->default('pending');

    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
