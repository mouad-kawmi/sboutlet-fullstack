<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::getConnection()->getDriverName() === 'sqlite') {
            return;
        }

        Schema::table('products', function (Blueprint $table) {
            $table->string('brand', 100)->nullable()->change();
            $table->string('category', 50)->nullable()->change();
            $table->string('condition_status', 50)->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::getConnection()->getDriverName() === 'sqlite') {
            return;
        }

        Schema::table('products', function (Blueprint $table) {
            $table->string('brand', 100)->nullable(false)->change();
            $table->string('category', 50)->nullable(false)->change();
            $table->string('condition_status', 50)->nullable(false)->change();
        });
    }
};
