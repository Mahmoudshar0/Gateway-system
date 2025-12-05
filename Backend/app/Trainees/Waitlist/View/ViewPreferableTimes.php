<?php

namespace App\Trainees\Waitlist\View;

use Exception;
use App\Models\Trainee;
use App\Models\GeneralMeta;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ViewPreferableTimes
{
    public function __construct(?Trainee $trainee)
    {
        Gate::authorize('viewTrainers', $trainee);
    }

    public function viewPreferableTimes(?GeneralMeta $preferable_time, Request $request)
    {
        try {
            // Determine meta_key based on age_group parameter
            if (!$request->filled('age_group')) {
                // If no age_group specified, return empty to enforce separation
                return response([], 200);
            }

            $age_group = $request->age_group;
            if (!in_array($age_group, ['Adult', 'Teen'])) {
                return response(['message' => 'Age group must be either Adult or Teen.'], 400);
            }

            // Determine meta_key based on age_group
            $meta_key = $age_group === 'Adult' ? 'preferable_times_adult' : 'preferable_times_teen';

            // Fetch preferable times for the specific age group
            $preferable_times = $preferable_time->where('meta_key', $meta_key)->get();

            $preferable_times_collection = [];

            foreach ($preferable_times as $key => $g_preferable_time) {
                $preferable_times_collection[$key] = [
                    'id' => $g_preferable_time->id,
                    'preferable_time' => $g_preferable_time->meta_value,
                    'age_group' => $age_group
                ];
            }

            return response($preferable_times_collection, 200);
        } catch (Exception $e) {
            return response(['message' => "Something went wrong. Preferable times cannot be viewed. Please contact the administrator of the website."], 400);
        }
    }
}
