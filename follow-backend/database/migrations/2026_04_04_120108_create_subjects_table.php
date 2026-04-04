<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subjects', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // bank_account, phone, facebook_link, other
            $table->string('raw_value');
            $table->string('normalized_value')->index();
            $table->string('display_value')->nullable();
            $table->string('status')->default('clean'); // clean, flagged, reviewing
            $table->unsignedInteger('risk_score')->default(0);
            $table->unsignedInteger('report_count')->default(0);
            $table->unsignedInteger('confirmed_report_count')->default(0);
            $table->timestamp('last_reported_at')->nullable();
            $table->timestamp('last_checked_at')->nullable();
            $table->text('notes_internal')->nullable();
            $table->timestamps();

            $table->unique(['type', 'normalized_value']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subjects');
    }
};