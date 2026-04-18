<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bank_webhook_transactions', function (Blueprint $table) {
            $table->id();

            $table->string('provider')->default('sepay');
            $table->string('provider_transaction_id')->unique();

            $table->string('gateway')->nullable();
            $table->string('account_number')->nullable();
            $table->string('reference_number')->nullable();

            $table->string('transfer_type')->nullable(); // in / out
            $table->decimal('amount', 15, 2)->default(0);

            $table->string('payment_code')->nullable();
            $table->text('content')->nullable();

            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();

            $table->boolean('is_processed')->default(false);
            $table->timestamp('processed_at')->nullable();

            $table->json('payload')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bank_webhook_transactions');
    }
};