<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Transition extends Model
{
    use HasFactory;

    // Table Name
    protected $table = 'gt_transitions';

    // Primary Key
    public $primaryKey = 'id';

    // Timestamps
    public $timestamps = true;

    protected $fillable = [
        'trainee_id',
        'user_id',
        'from_branch_id',
        'to_branch_id',
        'trainer_id',
        'transition_date'
    ];

    // Cast attributes to native types
    protected $casts = [
        'transition_date' => 'datetime',
    ];

    // Relationships
    public function trainee()
    {
        return $this->belongsTo(Trainee::class, 'trainee_id', 'id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function fromBranch()
    {
        return $this->belongsTo(Branch::class, 'from_branch_id', 'id');
    }

    public function toBranch()
    {
        return $this->belongsTo(Branch::class, 'to_branch_id', 'id');
    }

    public function trainer()
    {
        return $this->belongsTo(User::class, 'trainer_id', 'id');
    }
}
