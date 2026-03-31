<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('external_order_id')->nullable()->after('service_id');
            $table->string('external_status')->nullable()->after('status');
            $table->decimal('api_charge', 15, 2)->nullable()->after('total_price');
            $table->integer('api_start_count')->nullable()->after('api_charge');
            $table->integer('api_remains')->nullable()->after('api_start_count');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'external_order_id',
                'external_status',
                'api_charge',
                'api_start_count',
                'api_remains',
            ]);
        });
    }
};