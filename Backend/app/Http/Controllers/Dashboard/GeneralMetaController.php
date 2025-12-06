<?php

namespace App\Http\Controllers\Dashboard;

use App\Models\GeneralMeta;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class GeneralMetaController extends Controller
{
    public function __construct()
    {
        $this->current_user = auth()->user();
    }

    /**
     * Update meta_value based on trainer_id and meta_key
     */
    public function updateMetaValue(Request $request)
    {
        try {
            // Validate the request
            $request->validate([
                'trainer_id' => 'required|integer|exists:gt_users,id',
                'meta_key' => 'required|string',
                'meta_value' => 'required|string',
            ]);

            // Find the meta record by trainer_id and meta_key
            $meta = GeneralMeta::where('meta_key', $request->meta_key)
                ->where('id', $request->trainer_id)
                ->first();

            if (!$meta) {
                return response([
                    'message' => 'Meta record not found with the provided trainer_id and meta_key.'
                ], 404);
            }

            // Update the meta_value
            $meta->meta_value = $request->meta_value;
            $meta->save();

            return response([
                'message' => 'Meta value updated successfully.',
                'data' => [
                    'id' => $meta->id,
                    'meta_key' => $meta->meta_key,
                    'meta_value' => $meta->meta_value,
                ]
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response([
                'message' => 'Validation failed.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response([
                'message' => 'Something went wrong. Please contact the administrator.',
                'error' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Get meta value by trainer_id and meta_key
     */
    public function getMetaValue(Request $request)
    {
        try {
            // Validate the request
            $request->validate([
                'trainer_id' => 'required|integer',
                'meta_key' => 'required|string',
            ]);

            // Find the meta record
            $meta = GeneralMeta::where('meta_key', $request->meta_key)
                ->where('id', $request->trainer_id)
                ->first();

            if (!$meta) {
                return response([
                    'message' => 'Meta record not found.'
                ], 404);
            }

            return response([
                'data' => [
                    'id' => $meta->id,
                    'meta_key' => $meta->meta_key,
                    'meta_value' => $meta->meta_value,
                ]
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response([
                'message' => 'Validation failed.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response([
                'message' => 'Something went wrong. Please contact the administrator.'
            ], 400);
        }
    }
}
