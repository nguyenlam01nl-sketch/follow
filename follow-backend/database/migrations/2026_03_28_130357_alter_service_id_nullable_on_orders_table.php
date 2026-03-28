<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        // Nếu đang có foreign key thì phải drop trước
        try {
            Schema::table('orders', function (Blueprint $table) {
                $table->dropForeign(['service_id']);
            });
        } catch (\Throwable $e) {
            // bỏ qua nếu không có foreign key
        }

        Schema::table('orders', function (Blueprint $table) {
            $table->unsignedBigInteger('service_id')->nullable()->change();
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->foreign('service_id')
                ->references('id')
                ->on('services')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        try {
            Schema::table('orders', function (Blueprint $table) {
                $table->dropForeign(['service_id']);
            });
        } catch (\Throwable $e) {
        }

        Schema::table('orders', function (Blueprint $table) {
            $table->unsignedBigInteger('service_id')->nullable(false)->change();
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->foreign('service_id')
                ->references('id')
                ->on('services')
                ->cascadeOnDelete();
        });
    }
};