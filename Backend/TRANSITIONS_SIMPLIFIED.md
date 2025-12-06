# Branch Transitions Tracking Feature (Simplified)

## Overview

This feature automatically tracks when a trainee is transferred from one branch to another, storing the history in the `gt_transitions` table. Each transition also records which trainer the trainee had at the time of the transition.

---

## Database Structure

### Table: `gt_transitions`

| Column            | Type      | Description                              |
| ----------------- | --------- | ---------------------------------------- |
| `id`              | bigint    | Primary key                              |
| `trainee_id`      | bigint    | Foreign key to gt_trainees               |
| `user_id`         | bigint    | User who made the change                 |
| `from_branch_id`  | bigint    | Branch transferred from                  |
| `to_branch_id`    | bigint    | Branch transferred to                    |
| `trainer_id`      | bigint    | Trainer at time of transition (nullable) |
| `transition_date` | timestamp | When the transition occurred             |
| `created_at`      | timestamp | Record creation time                     |
| `updated_at`      | timestamp | Record update time                       |

---

## How It Works

### Automatic Tracking

When you update a trainee's branch through any of these endpoints:

- `PUT /api/v1/dashboard/waitlist/{id}/update`
- `PUT /api/v1/dashboard/pendinglist/{id}/update`
- `PUT /api/v1/dashboard/holdlist/{id}/update`
- `PUT /api/v1/dashboard/refundlist/{id}/update`
- `PUT /api/v1/dashboard/blacklist/{id}/update`

The system automatically:

1. Detects if the branch has changed
2. Creates a transition record with:
   - Old branch ID
   - New branch ID
   - Current trainer ID (at time of transition)
   - Current timestamp
   - User who made the change

---

## API Endpoints

### 1. View Trainee's Transition History

**Endpoint:**

```
GET /api/v1/dashboard/trainees/{trainee_id}/transitions
```

**Headers:**

```
Authorization: Bearer YOUR_TOKEN
Accept: application/json
```

**Response Example:**

```json
{
  "trainee": {
    "id": 2884,
    "full_name": "Ahmed Mohamed",
    "current_branch": "Dokki",
    "current_trainer": "Mohamed Ali"
  },
  "transitions": [
    {
      "id": 1,
      "from_branch": "Nasr City",
      "to_branch": "Dokki",
      "trainer": "Mohamed Ali",
      "transition_date": "2025-12-06 01:30:15",
      "changed_by": "Admin User",
      "created_at": "2025-12-06T01:30:15.000000Z"
    },
    {
      "id": 2,
      "from_branch": "Maadi",
      "to_branch": "Nasr City",
      "trainer": "Ahmed Salah",
      "transition_date": "2025-12-05 14:20:00",
      "changed_by": "John Doe",
      "created_at": "2025-12-05T14:20:00.000000Z"
    }
  ]
}
```

---

### 2. View All Transitions (Admin)

**Endpoint:**

```
GET /api/v1/dashboard/transitions
```

**Headers:**

```
Authorization: Bearer YOUR_TOKEN
Accept: application/json
```

**Optional Query Parameters:**

- `branch_id` - Filter by branch (shows transitions from or to this branch)
- `trainer_id` - Filter by trainer (shows transitions where this trainer was assigned)
- `start_date` - Filter by start date (YYYY-MM-DD)
- `end_date` - Filter by end date (YYYY-MM-DD)

**Example Requests:**

1. **Get transitions for a specific branch:**

```
GET /api/v1/dashboard/transitions?branch_id=1
```

2. **Get transitions for a specific trainer:**

```
GET /api/v1/dashboard/transitions?trainer_id=5
```

3. **Get transitions in a date range:**

```
GET /api/v1/dashboard/transitions?start_date=2025-12-01&end_date=2025-12-31
```

4. **Combined filters:**

```
GET /api/v1/dashboard/transitions?branch_id=1&start_date=2025-12-01
```

**Response Example:**

```json
{
  "transitions": [
    {
      "id": 1,
      "trainee_id": 2884,
      "trainee_name": "Ahmed Mohamed",
      "current_branch": "Dokki",
      "current_trainer": "Mohamed Ali",
      "from_branch": "Nasr City",
      "to_branch": "Dokki",
      "trainer": "Mohamed Ali",
      "transition_date": "2025-12-06 01:30:15",
      "changed_by": "Admin User",
      "created_at": "2025-12-06T01:30:15.000000Z"
    }
  ]
}
```

---

## Testing the Feature

### Test 1: Change Branch

**Request:**

```
PUT http://localhost:8000/api/v1/dashboard/waitlist/2884/update
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

**Body:**

```json
{
  "branch": "Dokki"
}
```

**Expected Result:**

- A transition record is created
- Records old branch, new branch, and current trainer

---

### Test 2: View Transition History

**Request:**

```
GET http://localhost:8000/api/v1/dashboard/trainees/2884/transitions
Authorization: Bearer YOUR_TOKEN
```

You should see all branch transitions for this trainee!

---

### Test 3: Filter by Trainer

**Request:**

```
GET http://localhost:8000/api/v1/dashboard/transitions?trainer_id=5
Authorization: Bearer YOUR_TOKEN
```

Shows all transitions where trainer ID 5 was assigned at the time.

---

## Model Relationships

### Trainee Model

```php
$trainee->transitions; // Get all transitions for this trainee
```

### Transition Model

```php
$transition->trainee;      // Get the trainee
$transition->fromBranch;   // Get the source branch
$transition->toBranch;     // Get the destination branch
$transition->trainer;      // Get the trainer at time of transition
$transition->user;         // Get the user who made the change
```

---

## Use Cases

### 1. Audit Trail

Track who moved trainees between branches and when.

### 2. Branch Analytics

Understand trainee movement patterns between branches.

### 3. Trainer Context

Know which trainer was responsible for the trainee at each branch.

### 4. Historical Reports

Generate reports showing trainee journey through different branches.

---

## Files Modified/Created

### Created:

1. `database/migrations/2025_12_06_004307_create_gt_transitions_table.php`
2. `database/migrations/2025_12_06_012408_simplify_transitions_table_remove_trainer_tracking.php`
3. `app/Models/Transition.php`
4. `app/Http/Controllers/Dashboard/Trainees/TransitionsController.php`

### Modified:

1. `app/Trainees/Helpers/UpdateTraineeEssentialData.php` - Added branch transition tracking
2. `app/Models/Trainee.php` - Added transitions relationship
3. `routes/api.php` - Added transition endpoints

---

## Notes

- Transitions are only recorded when the branch **actually changes**
- The first branch assignment (when creating a trainee) is **not** recorded as a transition
- All transitions include the user who made the change for audit purposes
- The `trainer_id` field captures which trainer was assigned at the time of the transition
- Transitions are ordered by date (newest first)
- Changing only the trainer does **not** create a transition record (only branch changes do)
