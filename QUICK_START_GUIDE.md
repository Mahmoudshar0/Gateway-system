# Quick Start Guide - Age Group Time Slot Separation

## What Changed?

### Before

- All preferable times were shared between Adult and Teen
- If an Adult took "Morning 9-11 AM", a Teen could also take it
- This caused scheduling conflicts

### After

- Adult has their own preferable times
- Teen has their own preferable times
- Same time name can exist for both groups separately
- No more conflicts!

## Installation

### Step 1: Run the Migration

```bash
cd Backend
php artisan migrate
```

This will:

- Add age_group to existing time slots
- Separate any shared time slots into Adult and Teen versions
- Update trainee references automatically

### Step 2: Test It

1. Open http://localhost:5173/waitlist
2. Click "Add Trainee" button
3. Select "Adult" in Age Group dropdown
4. Look at Preferable Time options (only Adult times)
5. Change Age Group to "Teen"
6. Look at Preferable Time options (only Teen times)

## Usage

### Adding a New Time Slot

1. Open "Add Trainee" modal
2. Select Age Group (Adult or Teen)
3. In Preferable Time field, click the "+" button
4. Enter the time slot name (e.g., "Morning 9-11 AM")
5. Click Add
6. The time slot is now available ONLY for the selected age group

### Viewing Time Slots

- Adult trainees see only Adult time slots
- Teen trainees see only Teen time slots
- Each group manages their own schedule independently

## Database Structure

```
gt_generalmeta table:
+----+------------------+-------------------+-----------+
| id | meta_key         | meta_value        | age_group |
+----+------------------+-------------------+-----------+
| 1  | preferable_times | Morning 9-11 AM   | Adult     |
| 2  | preferable_times | Morning 9-11 AM   | Teen      |
| 3  | preferable_times | Evening 6-8 PM    | Adult     |
+----+------------------+-------------------+-----------+
```

Notice: Same time name can exist for both Adult and Teen (different IDs)

## Troubleshooting

### Issue: No time slots appear

**Solution**: Make sure you selected an Age Group first

### Issue: Migration fails

**Solution**: Check that the age_group column exists in gt_generalmeta table

### Issue: Old time slots still shared

**Solution**: Run the migration again or manually set age_group values

## API Changes

### Creating Time Slot

**Before:**

```json
POST /api/v1/dashboard/waitlist/time/add
{
  "preferable_time": "Morning 9-11 AM"
}
```

**After:**

```json
POST /api/v1/dashboard/waitlist/time/add
{
  "preferable_time": "Morning 9-11 AM",
  "age_group": "Adult"
}
```

### Fetching Time Slots

**Before:**

```
GET /api/v1/dashboard/waitlist/times
```

**After:**

```
GET /api/v1/dashboard/waitlist/times?age_group=Adult
```

## Support

If you encounter any issues, check:

1. Migration ran successfully
2. Age group is selected in the form
3. Browser console for any errors
4. Backend logs for API errors
