<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('ref_code', 50)->unique()->nullable()->after('email');
            $table->unsignedBigInteger('referred_by')->nullable()->after('ref_code');
            $table->timestamp('ref_rewarded_at')->nullable()->after('referred_by');

            $table->foreign('referred_by')
                ->references('id')
                ->on('users')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['referred_by']);
            $table->dropColumn([
                'ref_code',
                'referred_by',
                'ref_rewarded_at',
            ]);
        });
    }
};