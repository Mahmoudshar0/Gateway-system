# Testing Checklist - Age Group Time Slot Separation

## Pre-Testing Setup

- [ ] Run migration: `cd Backend && php artisan migrate`
- [ ] Verify migration success (no errors)
- [ ] Clear browser cache
- [ ] Restart backend server if running
- [ ] Restart frontend dev server if running

## Test 1: View Separation

### Adult Time Slots

- [ ] Go to http://localhost:5173/waitlist
- [ ] Click "Add Trainee" button
- [ ] Select "Adult" in Age Group dropdown
- [ ] Click on "Preferable time of slot" dropdown
- [ ] Note down the available time slots
- [ ] Verify time slots appear

### Teen Time Slots

- [ ] Keep the same modal open
- [ ] Change Age Group to "Teen"
- [ ] Click on "Preferable time of slot" dropdown again
- [ ] Verify different time slots appear (or empty if no Teen slots exist)
- [ ] Verify Adult time slots are NOT visible

**Expected Result:** Adult and Teen see different time slot lists

## Test 2: Create New Time Slot for Adult

- [ ] Select "Adult" in Age Group
- [ ] In Preferable Time field, click the "+" button
- [ ] Enter "Test Adult Morning 9-11 AM"
- [ ] Click Add/Submit
- [ ] Verify success message appears
- [ ] Verify "Test Adult Morning 9-11 AM" now appears in Adult dropdown
- [ ] Change Age Group to "Teen"
- [ ] Verify "Test Adult Morning 9-11 AM" does NOT appear in Teen dropdown

**Expected Result:** New time slot only visible for Adult

## Test 3: Create New Time Slot for Teen

- [ ] Select "Teen" in Age Group
- [ ] In Preferable Time field, click the "+" button
- [ ] Enter "Test Teen Morning 9-11 AM" (same name as Adult)
- [ ] Click Add/Submit
- [ ] Verify success message appears
- [ ] Verify "Test Teen Morning 9-11 AM" now appears in Teen dropdown
- [ ] Change Age Group to "Adult"
- [ ] Verify both "Test Adult Morning 9-11 AM" and "Test Teen Morning 9-11 AM" do NOT appear together
- [ ] Verify only "Test Adult Morning 9-11 AM" appears for Adult

**Expected Result:** Same time name can exist for both groups separately

## Test 4: Create Trainee with Adult Time Slot

- [ ] Fill in all required fields
- [ ] Select "Adult" in Age Group
- [ ] Select "Test Adult Morning 9-11 AM" in Preferable Time
- [ ] Click "Add Trainee"
- [ ] Verify trainee is created successfully
- [ ] Find the trainee in the waitlist table
- [ ] Click edit on the trainee
- [ ] Verify Age Group shows "Adult"
- [ ] Verify Preferable Time shows "Test Adult Morning 9-11 AM"
- [ ] Verify only Adult time slots appear in dropdown

**Expected Result:** Adult trainee saved with Adult time slot

## Test 5: Create Trainee with Teen Time Slot

- [ ] Click "Add Trainee" again
- [ ] Fill in all required fields
- [ ] Select "Teen" in Age Group
- [ ] Select "Test Teen Morning 9-11 AM" in Preferable Time
- [ ] Click "Add Trainee"
- [ ] Verify trainee is created successfully
- [ ] Find the trainee in the waitlist table
- [ ] Click edit on the trainee
- [ ] Verify Age Group shows "Teen"
- [ ] Verify Preferable Time shows "Test Teen Morning 9-11 AM"
- [ ] Verify only Teen time slots appear in dropdown

**Expected Result:** Teen trainee saved with Teen time slot

## Test 6: Edit Existing Trainee

### Edit Adult Trainee

- [ ] Find an existing Adult trainee
- [ ] Click edit
- [ ] Verify Age Group is "Adult"
- [ ] Open Preferable Time dropdown
- [ ] Verify only Adult time slots appear
- [ ] Try changing to a different Adult time slot
- [ ] Save changes
- [ ] Verify changes saved successfully

### Edit Teen Trainee

- [ ] Find an existing Teen trainee
- [ ] Click edit
- [ ] Verify Age Group is "Teen"
- [ ] Open Preferable Time dropdown
- [ ] Verify only Teen time slots appear
- [ ] Try changing to a different Teen time slot
- [ ] Save changes
- [ ] Verify changes saved successfully

**Expected Result:** Each trainee only sees their age group's time slots

## Test 7: Delete Time Slot

- [ ] Open "Add Trainee" modal
- [ ] Select "Adult" in Age Group
- [ ] In Preferable Time dropdown, find "Test Adult Morning 9-11 AM"
- [ ] Click the delete/trash icon next to it
- [ ] Confirm deletion
- [ ] Verify success message
- [ ] Verify "Test Adult Morning 9-11 AM" no longer appears in Adult dropdown
- [ ] Change to "Teen" Age Group
- [ ] Verify "Test Teen Morning 9-11 AM" still exists (not affected)

**Expected Result:** Deleting Adult time slot doesn't affect Teen time slots

## Test 8: Secondary Preferable Time

- [ ] Open "Add Trainee" modal
- [ ] Select "Adult" in Age Group
- [ ] Select a time in "Preferable time of slot"
- [ ] Select a different time in "Second Preferable time of slot"
- [ ] Verify both dropdowns show only Adult time slots
- [ ] Change Age Group to "Teen"
- [ ] Verify both dropdowns update to show only Teen time slots

**Expected Result:** Both primary and secondary time fields respect age group

## Test 9: Database Verification

Run these SQL queries to verify data integrity:

```sql
-- Check all preferable times have age_group
SELECT id, meta_value, age_group
FROM gt_generalmeta
WHERE meta_key = 'preferable_times'
AND age_group IS NULL;
```

- [ ] Verify result is empty (no NULL age_groups)

```sql
-- Check Adult time slots
SELECT id, meta_value, age_group
FROM gt_generalmeta
WHERE meta_key = 'preferable_times'
AND age_group = 'Adult';
```

- [ ] Verify Adult time slots exist

```sql
-- Check Teen time slots
SELECT id, meta_value, age_group
FROM gt_generalmeta
WHERE meta_key = 'preferable_times'
AND age_group = 'Teen';
```

- [ ] Verify Teen time slots exist

```sql
-- Check trainee assignments match age groups
SELECT t.id, t.full_name, t.age_group as trainee_age,
       gm.meta_value as time_slot, gm.age_group as slot_age
FROM gt_trainees t
LEFT JOIN gt_generalmeta gm ON t.preferable_time = gm.id
WHERE t.current_list = 2423
AND t.age_group != gm.age_group;
```

- [ ] Verify result is empty (no mismatches)

**Expected Result:** All data properly separated by age group

## Test 10: Error Handling

### Try to create time slot without age group

- [ ] Open browser console
- [ ] Try to manually call API without age_group
- [ ] Verify error message appears
- [ ] Verify time slot is NOT created

**Expected Result:** System prevents creating time slots without age group

## Test 11: Migration Verification

```sql
-- Check if migration ran
SELECT * FROM migrations
WHERE migration LIKE '%set_age_group_for_existing_preferable_times%';
```

- [ ] Verify migration entry exists

**Expected Result:** Migration recorded in database

## Issues Found

Document any issues here:

| Test # | Issue Description | Severity | Status |
| ------ | ----------------- | -------- | ------ |
|        |                   |          |        |

## Sign-off

- [ ] All tests passed
- [ ] No critical issues found
- [ ] Documentation reviewed
- [ ] Ready for production

**Tested by:** ******\_\_\_******
**Date:** ******\_\_\_******
**Signature:** ******\_\_\_******
