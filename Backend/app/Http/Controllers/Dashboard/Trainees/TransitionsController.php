<?php

namespace App\Http\Controllers\Dashboard\Trainees;

use App\Models\Trainee;
use App\Models\Transition;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class TransitionsController extends Controller
{
    public function __construct()
    {
        $this->current_user = auth()->user();
    }

    /**
     * Get all transitions for a specific trainee
     */
    public function viewTraineeTransitions($trainee_id)
    {
        try {
            $trainee = Trainee::find($trainee_id);

            if (!$trainee) {
                return response(['message' => 'Trainee not found.'], 404);
            }

            $transitions = Transition::where('trainee_id', $trainee_id)
                ->with([
                    'fromBranch:id,district',
                    'toBranch:id,district',
                    'trainer:id,full_name',
                    'user:id,full_name'
                ])
                ->orderBy('transition_date', 'desc')
                ->get()
                ->map(function ($transition) {
                    return [
                        'id' => $transition->id,
                        'from_branch' => $transition->fromBranch->district ?? null,
                        'to_branch' => $transition->toBranch->district ?? null,
                        'trainer' => $transition->trainer->full_name ?? null,
                        'transition_date' => $transition->transition_date->format('Y-m-d'),
                        'transition_time' => $transition->transition_date->format('H:i:s'),
                        'changed_by' => $transition->user->full_name ?? 'System',
                        'created_at' => $transition->created_at,
                    ];
                });

            return response([
                'trainee' => [
                    'id' => $trainee->id,
                    'full_name' => $trainee->full_name,
                    'current_branch' => $trainee->branch->district ?? null,
                    'current_trainer' => $trainee->user->full_name ?? null,
                ],
                'transitions' => $transitions
            ], 200);
        } catch (\Exception $e) {
            return response(['message' => 'Something went wrong. Please contact the administrator.'], 400);
        }
    }

    /**
     * Get all transitions (admin view)
     */
    public function viewAllTransitions(Request $request)
    {
        try {
            $query = Transition::with([
                'trainee:id,full_name,branch_id,trainer_id',
                'trainee.branch:id,district',
                'trainee.user:id,full_name',
                'fromBranch:id,district',
                'toBranch:id,district',
                'trainer:id,full_name',
                'user:id,full_name'
            ])->orderBy('transition_date', 'desc');

            // Filter by branch if provided
            if ($request->filled('branch_id')) {
                $query->where(function ($q) use ($request) {
                    $q->where('from_branch_id', $request->branch_id)
                        ->orWhere('to_branch_id', $request->branch_id);
                });
            }

            // Filter by trainer if provided
            if ($request->filled('trainer_id')) {
                $query->where('trainer_id', $request->trainer_id);
            }

            // Filter by date range if provided
            if ($request->filled('start_date')) {
                $query->whereDate('transition_date', '>=', $request->start_date);
            }
            if ($request->filled('end_date')) {
                $query->whereDate('transition_date', '<=', $request->end_date);
            }

            $transitions = $query->get()->map(function ($transition) {
                return [
                    'id' => $transition->id,
                    'trainee_id' => $transition->trainee->id,
                    'trainee_name' => $transition->trainee->full_name,
                    'current_branch' => $transition->trainee->branch->district ?? null,
                    'current_trainer' => $transition->trainee->user->full_name ?? null,
                    'from_branch' => $transition->fromBranch->district ?? null,
                    'to_branch' => $transition->toBranch->district ?? null,
                    'trainer' => $transition->trainer->full_name ?? null,
                    'transition_date' => $transition->transition_date->format('Y-m-d'),
                    'transition_time' => $transition->transition_date->format('H:i:s'),
                    'changed_by' => $transition->user->full_name ?? 'System',
                    'created_at' => $transition->created_at,
                ];
            });

            return response(['transitions' => $transitions], 200);
        } catch (\Exception $e) {
            return response(['message' => 'Something went wrong. Please contact the administrator.'], 400);
        }
    }
}
