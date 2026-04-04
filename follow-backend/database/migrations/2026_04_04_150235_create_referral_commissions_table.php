<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('referral_commissions', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('referrer_id');
            $table->unsignedBigInteger('referred_user_id');

            $table->unsignedBigInteger('wallet_transaction_id')->nullable();

            $table->enum('type', ['signup_bonus', 'first_deposit_bonus', 'deposit_commission']);
            $table->decimal('source_amount', 15, 2)->default(0);
            $table->decimal('commission_amount', 15, 2)->default(0);
            $table->decimal('commission_rate', 5, 2)->default(0);

            $table->string('note')->nullable();
            $table->timestamps();

            $table->foreign('referrer_id')
                ->references('id')
                ->on('users')
                ->cascadeOnDelete();

            $table->foreign('referred_user_id')
                ->references('id')
                ->on('users')
                ->cascadeOnDelete();

            $table->foreign('wallet_transaction_id')
                ->references('id')
                ->on('wallet_transactions')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('referral_commissions');
    }
};