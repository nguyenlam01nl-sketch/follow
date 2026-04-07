<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('users', 'register_ip')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('register_ip', 45)
                    ->nullable()
                    ->after('ref_rewarded_at');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('users', 'register_ip')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('register_ip');
            });
        }
    }
};