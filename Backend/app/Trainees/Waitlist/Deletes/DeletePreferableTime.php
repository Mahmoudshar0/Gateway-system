<?php

namespace App\Trainees\Waitlist\Deletes;

use Exception;
use App\Models\Trainee;
use App\Models\GeneralMeta;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Traits\CheckPermission;

class DeletePreferableTime
{
    use CheckPermission;

    protected $current_user;

    public function __construct()
    {
        $this->current_user = auth()->user();
    }

    public function deletePreferableTime($id)
    {
        try {
            // Authorization check - ensure user has permission to manage waitlist preferable times
            $permissions = ['create_trainees', 'update_trainees', 'update_own_trainees', 'create_trainees_by_branch', 'update_trainees_by_branch'];
            if (!$this->CheckPermission($this->current_user, $permissions, 'waitlist')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized to perform this action'
                ], 403);
            }

            // Start database transaction
            DB::beginTransaction();

            // Find the preferable time by ID (check both adult and teen meta_keys)
            $gPreferableTime = GeneralMeta::where('id', $id)
                ->whereIn('meta_key', ['preferable_times_adult', 'preferable_times_teen'])
                ->first();

            if (!$gPreferableTime) {
                DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => 'Preferable time not found'
                ], 404);
            }

            // Check if any trainees are currently assigned to this preferable time
            $traineeCount = Trainee::where('preferable_time', $id)
                ->orWhere('sec_preferable_time', $id)
                ->count();

            // Update trainees to remove this preferable time assignment
            $affected = 0;
            if ($traineeCount > 0) {
                // Update primary preferable time
                $affected += Trainee::where('preferable_time', $id)->update(['preferable_time' => null]);

                // Update secondary preferable time
                $affected += Trainee::where('sec_preferable_time', $id)->update(['sec_preferable_time' => null]);
            }

            // Delete the preferable time meta entry
            $gPreferableTime->delete();

            // Commit the transaction
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Preferable time deleted successfully',
                'affected_trainees' => $affected,
                'preferable_time_name' => $gPreferableTime->meta_value ?? 'Unknown'
            ], 200);
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Error deleting preferable time: ' . $e->getMessage(), [
                'preferable_time_id' => $id,
                'user_id' => $this->current_user->id ?? null
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Something went wrong. Preferable time cannot be deleted. Please contact the administrator.'
            ], 500);
        }
    }
}
