<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('wallet_transactions', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->after('id')->constrained()->cascadeOnDelete();
            $table->string('title')->nullable()->after('user_id');
            $table->decimal('amount', 15, 2)->default(0)->after('title');
            $table->enum('type', ['deposit', 'payment'])->default('deposit')->after('amount');
            $table->enum('status', ['pending', 'completed', 'failed'])->default('pending')->after('type');
            $table->string('payment_method')->nullable()->after('status');
            $table->text('note')->nullable()->after('payment_method');
        });
    }

    public function down(): void
    {
        Schema::table('wallet_transactions', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn([
                'user_id',
                'title',
                'amount',
                'type',
                'status',
                'payment_method',
                'note',
            ]);
        });
    }
};