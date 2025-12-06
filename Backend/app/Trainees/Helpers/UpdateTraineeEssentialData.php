<?php

namespace App\Trainees\Helpers;

use Carbon\Carbon;
use App\Models\Transition;

trait UpdateTraineeEssentialData
{
    protected function UpdateTraineeEssentialData($trainee, $request, $class)
    {
        // Store the old values before updating
        $oldBranchId = $trainee->branch_id;
        $oldTrainerId = $trainee->trainer_id;

        // Determine new branch_id
        $newBranchId = ($class->CheckPermissionByBranch($class, $class->permission_collection, $class->current_permission, $class->permission_keys)
            ? $class->current_user->branch_id
            : ($request->filled('branch') ? $class->Branch($request->branch)->id : $class->current_user->branch_id));

        // Update branch_id
        $trainee->branch_id = $newBranchId;

        $request->filled('full_name') && $trainee->full_name = $request->full_name;

        $request->filled('notes') && $trainee->notes = $request->notes;

        $request->filled('attend_type') && $trainee->attend_type = $request->attend_type;

        if ($request->filled('payment_type')) {
            $paymentMeta = $class->GetGeneralMeta($request->payment_type);
            $paymentMeta && $trainee->payment_type = $paymentMeta->id;
        }

        if ($request->filled('level')) {
            $levelMeta = $class->GetGeneralMeta($request->level);
            $levelMeta && $trainee->level = $levelMeta->id;
        }

        if ($request->filled('preferable_time')) {
            $timeMeta = $class->GetGeneralMeta($request->preferable_time);
            $timeMeta && $trainee->preferable_time = $timeMeta->id;
        }

        if ($request->filled('sec_preferable_time')) {
            $secTimeMeta = $class->GetGeneralMeta($request->sec_preferable_time);
            $secTimeMeta && $trainee->sec_preferable_time = $secTimeMeta->id;
        }

        // Update trainer if provided
        if ($request->filled('trainer') && $class->permission_collection === 'waitlist') {
            $trainee->trainer_id = $class->User($request->trainer)->id;
        }

        ($request->filled('follow_up') && $class->permission_collection === 'pendinglist') && $trainee->follow_up = $class->User($request->follow_up)->id;

        $request->filled('test_date') && $trainee->test_date = Carbon::parse($request->test_date);

        if (count($request->all()) >= 1) {
            $trainee->save();

            // Track branch transition if branch changed
            if ($oldBranchId !== $newBranchId && $oldBranchId !== null) {
                Transition::create([
                    'trainee_id' => $trainee->id,
                    'user_id' => $class->current_user->id,
                    'from_branch_id' => $oldBranchId,
                    'to_branch_id' => $newBranchId,
                    'trainer_id' => $trainee->trainer_id, // Current trainer at time of transition
                    'transition_date' => Carbon::now(),
                ]);
            }
        }

        return $trainee;
    }
}
