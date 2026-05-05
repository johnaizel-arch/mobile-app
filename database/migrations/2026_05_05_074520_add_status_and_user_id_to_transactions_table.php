<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up()
{
    Schema::table('transactions', function (Blueprint $table) {
        // Add the columns the error is complaining about
        if (!Schema::hasColumn('transactions', 'status')) {
            $table->string('status')->default('pending')->after('type');
        }
        if (!Schema::hasColumn('transactions', 'user_id')) {
            $table->integer('user_id')->nullable()->after('status');
        }
        if (!Schema::hasColumn('transactions', 'date')) {
            $table->string('date')->nullable()->after('user_id');
        }
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            // Drop the columns if they exist
            if (Schema::hasColumn('transactions', 'status')) {
                $table->dropColumn('status');
            }
            if (Schema::hasColumn('transactions', 'user_id')) {
                $table->dropColumn('user_id');
            }
            if (Schema::hasColumn('transactions', 'date')) {
                $table->dropColumn('date');
            }
        });
    }
};
