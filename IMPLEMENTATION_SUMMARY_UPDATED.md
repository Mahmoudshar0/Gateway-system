# Age Group Time Slot Separation - Implementation Summary

## What Was Done

Successfully implemented separation of preferable time slots between Adult and Teen age groups using separate `meta_key` values.

## Database Structure

### gt_generalmeta table entries:

**For Adult time slots:**

```
meta_key: preferable_times_adult
meta_value: Morning 9-11 AM
```

**For Teen time slots:**

```
meta_key: preferable_times_teen
meta_value: Morning 9-11 AM
```

## Files Modified

### Backend (4 files)

1. **Backend/app/Trainees/Waitlist/Add/AddPreferableTime.php**

   - Uses `preferable_times_adult` or `preferable_times_teen` as meta_key based on age_group

2. **Backend/app/Trainees/Waitlist/View/ViewPreferableTimes.php**

   - Filters by meta_key based on age_group parameter

3. **Backend/app/Trainees/Waitlist/Deletes/DeletePreferableTime.php**

   - Handles both `preferable_times_adult` and `preferable_times_teen` meta_keys

4. **Backend/app/Models/GeneralMeta.php**
   - Removed age_group column references

### Frontend (2 files)

1. **Frontend/src/store/reducers/WaitList/View/ViewSlice.js**

   - Updated Redux actions to pass age_group parameter

2. **Frontend/src/components/Gateway-System/Inputs/WaitList/PreferableTime Wait/PreferableTime.jsx**
   - Updated component to use age_group for fetching and creating time slots

## No Migration Needed

Since we're using different `meta_key` values instead of an age_group column, no database migration is required.

## API Endpoints

### Get Adult Time Slots

```
GET /api/v1/dashboard/waitlist/times?age_group=Adult
```

### Get Teen Time Slots

```
GET /api/v1/dashboard/waitlist/times?age_group=Teen
```

### Create Adult Time Slot

```
POST /api/v1/dashboard/waitlist/time/add
Body: {
  "preferable_time": "Morning 9-11 AM",
  "age_group": "Adult"
}
```

### Create Teen Time Slot

```
POST /api/v1/dashboard/waitlist/time/add
Body: {
  "preferable_time": "Morning 9-11 AM",
  "age_group": "Teen"
}
```

## How It Works

1. User selects "Adult" age group → System fetches entries where `meta_key = 'preferable_times_adult'`
2. User selects "Teen" age group → System fetches entries where `meta_key = 'preferable_times_teen'`
3. Each age group has completely separate meta_key values
4. Same time slot name can exist for both groups without conflict

## Testing

1. Go to http://localhost:5173/waitlist
2. Click "Add Trainee"
3. Select "Adult" age group → See only Adult time slots
4. Select "Teen" age group → See only Teen time slots
5. Add same time name for both groups → Both succeed with different IDs
