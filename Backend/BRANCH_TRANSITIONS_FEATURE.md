# Branch Transitions Tracking Feature

## Overview

This feature automatically tracks when a trainee is transferred from one branch to another, storing the history in the `gt_transitions` table.

---

## Database Structure

### Table: `gt_transitions`

| Column            | Type      | Description                |
| ----------------- | --------- | -------------------------- |
| `id`              | bigint    | Primary key                |
| `trainee_id`      | bigint    | Foreign key to gt_trainees |
| `user_id`         | bigint    | User who made the change   |
| `from_branch_id`  | bigint    | Branch transferred from    |
| `to_branch_id`    | bigint    | Branch transferred to      |
| `transition_date` | timestamp | When the transfer occurred |
| `created_at`      | timestamp | Record creation time       |
| `updated_at`      | timestamp | Record update time         |

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
    "current_branch": "Dokki"
  },
  "transitions": [
    {
      "id": 1,
      "from_branch": "Nasr City",
      "to_branch": "Dokki",
      "transition_date": "2025-12-06 00:30:15",
      "changed_by": "Admin User",
      "created_at": "2025-12-06T00:30:15.000000Z"
    },
    {
      "id": 2,
      "from_branch": "Dokki",
      "to_branch": "Maadi",
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
- `start_date` - Filter by start date (YYYY-MM-DD)
- `end_date` - Filter by end date (YYYY-MM-DD)

**Example Request:**

```
GET /api/v1/dashboard/transitions?branch_id=1&start_date=2025-12-01&end_date=2025-12-31
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
      "from_branch": "Nasr City",
      "to_branch": "Dokki",
      "transition_date": "2025-12-06 00:30:15",
      "changed_by": "Admin User",
      "created_at": "2025-12-06T00:30:15.000000Z"
    }
  ]
}
```

---

## Testing the Feature

### Step 1: Update a Trainee's Branch

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

### Step 2: View the Transition History

**Request:**

```
GET http://localhost:8000/api/v1/dashboard/trainees/2884/transitions
Authorization: Bearer YOUR_TOKEN
```

You should see the branch change recorded!

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
$transition->user;         // Get the user who made the change
```

---

## Files Modified/Created

### Created:

1. `database/migrations/2025_12_06_004307_create_gt_transitions_table.php`
2. `app/Models/Transition.php`
3. `app/Http/Controllers/Dashboard/Trainees/TransitionsController.php`

### Modified:

1. `app/Trainees/Helpers/UpdateTraineeEssentialData.php` - Added transition tracking
2. `app/Models/Trainee.php` - Added transitions relationship
3. `routes/api.php` - Added transition endpoints

---

## Notes

- Transitions are only recorded when the branch **actually changes**
- The first branch assignment (when creating a trainee) is **not** recorded as a transition
- All transitions include the user who made the change for audit purposes
- Transitions are ordered by date (newest first)
