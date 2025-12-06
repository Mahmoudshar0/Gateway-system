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
        Schema::create('gt_transitions', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('trainee_id')->unsigned();
            $table->foreign('trainee_id')->references('id')->on('gt_trainees')->onDelete('cascade');
            $table->bigInteger('user_id')->unsigned()->nullable();
            $table->foreign('user_id')->references('id')->on('gt_users');
            $table->bigInteger('from_branch_id')->unsigned();
            $table->foreign('from_branch_id')->references('id')->on('gt_branches');
            $table->bigInteger('to_branch_id')->unsigned();
            $table->foreign('to_branch_id')->references('id')->on('gt_branches');
            $table->timestamp('transition_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gt_transitions');
    }
};
