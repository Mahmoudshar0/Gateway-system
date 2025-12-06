<?php

namespace App\Models;

use App\Models\User;
use App\Models\Branch;
use App\Models\GtList;
use App\Models\TraineeMeta;
use App\Models\TraineeClass;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Trainee extends Model
{
    use HasFactory;

    // Table Name
    protected $table = 'gt_trainees';
    // Primary Key
    public $primaryKey = 'id';
    // Timestamps
    public $timestamps = true;

    protected $fillable = [
        "user_id",
        "follow_up",
        "trainer_id",
        'branch_id',
        'full_name',
        'notes',
        'attend_type',
        "level",
        "payment_type",
        "preferable_time",
        'current_list',
        'previous_list',
        'test_date',
        'moved_date'
    ];

    public function list()
    {
        return $this->belongsTo(GtList::class, 'current_list', 'id');
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class, 'branch_id', 'id');
    }

    public function trainee_meta()
    {
        return $this->hasMany(TraineeMeta::class, 'trainee_id', 'id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'trainer_id', 'id');
    }

    public function trainee_classes()
    {
        return $this->hasMany(TraineeClass::class, 'trainee_id', 'id');
    }

    public function follow_up_user()
    {
        return $this->belongsTo(User::class, 'follow_up', 'id');
    }

    public function transitions()
    {
        return $this->hasMany(Transition::class, 'trainee_id', 'id');
    }
}
