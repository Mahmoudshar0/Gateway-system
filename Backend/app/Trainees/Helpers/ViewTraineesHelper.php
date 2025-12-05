<?php

namespace App\Trainees\Helpers;

trait ViewTraineesHelper
{
    protected function viewTrainees($trainees, $request, $class)
    {
        $data = [];

        // Get the list ID first to filter efficiently
        $listId = $class->List($class->list)->id;

        // Build query with eager loading to prevent N+1 queries
        $query = $trainees->with([
            'list:id,list_title',
            'branch:id,district',
            'trainee_meta:trainee_id,meta_key,meta_value',
            'user:id,full_name', // trainer
            'follow_up_user:id,full_name'
        ])
            ->where('current_list', $listId) // Filter by list at query level
            ->orderBy('created_at', 'desc');

        // Apply permission-based filtering
        if ($class->CheckPermissionStatus($class->current_user, $class->permission_collection, 'view_trainees')) {
            if ($request->filled('branch')) {
                $query->where('branch_id', $class->Branch($request->branch)->id);
            }
            $data = $class->getCollection($query->get(), $class);
        } elseif ($class->CheckPermissionStatus($class->current_user, $class->permission_collection, 'view_own_trainees') && count($data) === 0) {
            $query->where('trainer_id', $class->current_user->id);
            if ($request->filled('branch')) {
                $query->where('branch_id', $class->Branch($request->branch)->id);
            }
            $data = $class->getCollection($query->get(), $class);
        } elseif ($this->CheckPermissionByBranch($class, $class->permission_collection, $class->current_permission, $class->permission_keys)) {
            $query->where('branch_id', $class->current_user->branch_id);
            $data = $class->getCollection($query->get(), $class);
        }

        $trainees_data = $data;

        $current_list = count($trainees_data);

        $sub_message = $current_list === 0 ?  response(['message' => 'This list is empty'], 200) : response(['message' => 'Unauthorized'], 401);

        $message = count($trainees_data) === 0 ? $sub_message : response(['trainees' => $trainees_data], 201);

        return $message;
    }
}
