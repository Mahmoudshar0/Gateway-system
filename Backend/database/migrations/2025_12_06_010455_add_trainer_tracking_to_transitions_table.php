<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('gt_transitions', function (Blueprint $table) {
            $table->bigInteger('from_trainer_id')->unsigned()->nullable()->after('to_branch_id');
            $table->foreign('from_trainer_id')->references('id')->on('gt_users');
            $table->bigInteger('to_trainer_id')->unsigned()->nullable()->after('from_trainer_id');
            $table->foreign('to_trainer_id')->references('id')->on('gt_users');
            $table->enum('transition_type', ['branch', 'trainer', 'both'])->default('branch')->after('to_trainer_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('gt_transitions', function (Blueprint $table) {
            $table->dropForeign(['from_trainer_id']);
            $table->dropForeign(['to_trainer_id']);
            $table->dropColumn(['from_trainer_id', 'to_trainer_id', 'transition_type']);
        });
    }
};
