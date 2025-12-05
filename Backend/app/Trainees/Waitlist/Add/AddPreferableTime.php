<?php

namespace App\Trainees\Waitlist\Add;

use Exception;
use App\Models\Trainee;
use App\Models\GeneralMeta;
use Illuminate\Http\Request;
use App\Traits\SendNotification;
use Illuminate\Support\Facades\Gate;

class AddPreferableTime
{
    use SendNotification;

    protected $current_user;

    public function __construct(?Trainee $trainee)
    {
        Gate::authorize('viewTrainers', $trainee);

        $this->current_user = auth()->user();
    }

    public function addPreferableTime(?GeneralMeta $preferable_time, Request $request)
    {
        try {
            // Validate required fields
            if (!$request->filled('preferable_time')) {
                return response(['message' => 'Preferable time is required.'], 400);
            }

            if (!$request->filled('age_group')) {
                return response(['message' => 'Age group is required.'], 400);
            }

            // Validate age_group value
            $age_group = $request->age_group;
            if (!in_array($age_group, ['Adult', 'Teen'])) {
                return response(['message' => 'Age group must be either Adult or Teen.'], 400);
            }

            // Determine meta_key based on age_group
            $meta_key = $age_group === 'Adult' ? 'preferable_times_adult' : 'preferable_times_teen';

            // Trim and normalize the preferable time value
            $preferable_time_value = trim($request->preferable_time);

            // Prevent adding age group values as time slots
            $forbidden_values = ['adult', 'teen', 'online', 'offline', 'hybrid', 'private'];
            if (in_array(strtolower($preferable_time_value), $forbidden_values)) {
                return response(['message' => 'Invalid preferable time value. Please enter a valid time slot (e.g., "Morning 9-11 AM").'], 400);
            }

            // Check if preferable time already exists for this age group (case-insensitive)
            $is_exists = $preferable_time->where('meta_key', $meta_key)
                ->whereRaw('LOWER(meta_value) = ?', [strtolower($preferable_time_value)])
                ->exists();

            if ($is_exists) {
                return response(['message' => "This preferable time already exists for {$age_group} age group."], 400);
            }

            // Create the new preferable time with appropriate meta_key
            $preferable_time->create([
                'meta_key' => $meta_key,
                'meta_value' => $preferable_time_value,
            ]);

            $this->notifyUser("has added a new preferable time ({$age_group}) to the wait list", $this->current_user, 'create_trainees_in_waitlist');

            return response(['message' => "Preferable time added successfully for {$age_group} age group"], 200);
        } catch (Exception $e) {
            return response(['message' => "Something went wrong. Preferable time cannot be added. Please contact the administrator of the website."], 400);
        }
    }
}
