<?php

namespace Tests\Feature;

use App\Models\GeneralMeta;
use Eris\Generator;
use Eris\TestTrait;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Property-based tests for time slot age group separation
 */
class TimeSlotAgeGroupPropertyTest extends TestCase
{
    use TestTrait;

    protected function setUp(): void
    {
        parent::setUp();

        // Run migrations without seeding
        $this->artisan('migrate:fresh');
    }

    /**
     * Feature: age-group-time-slot-separation, Property 1: Time slot age group exclusivity
     * 
     * Property 1: Time slot age group exclusivity
     * For any time slot in the system, it must be assigned to exactly one age group 
     * (either "Adult" or "Teen", never both, never neither)
     * 
     * Validates: Requirements 1.1
     */
    #[\PHPUnit\Framework\Attributes\Test]
    public function property_time_slot_must_have_exactly_one_age_group()
    {
        $this->forAll(
            Generator\choose(1, 100), // Generate random number of time slots
            Generator\seq(Generator\elements('Adult', 'Teen')) // Generate sequence of age groups
        )
            ->then(function ($numSlots, $ageGroups) {
                // Create time slots with age groups
                $timeSlots = [];
                for ($i = 0; $i < min($numSlots, count($ageGroups)); $i++) {
                    $timeSlot = GeneralMeta::create([
                        'meta_key' => 'preferable_time',
                        'meta_value' => "Test Time Slot {$i} - " . uniqid(),
                        'age_group' => $ageGroups[$i]
                    ]);
                    $timeSlots[] = $timeSlot;
                }

                // Verify each time slot has exactly one age group
                foreach ($timeSlots as $slot) {
                    $freshSlot = GeneralMeta::find($slot->id);

                    // Assert age_group is not null (has a value)
                    $this->assertNotNull(
                        $freshSlot->age_group,
                        "Time slot {$freshSlot->id} must have an age group assigned"
                    );

                    // Assert age_group is either 'Adult' or 'Teen'
                    $this->assertContains(
                        $freshSlot->age_group,
                        ['Adult', 'Teen'],
                        "Time slot {$freshSlot->id} must be assigned to either 'Adult' or 'Teen'"
                    );

                    // Assert it's exactly one value (not both)
                    $this->assertTrue(
                        in_array($freshSlot->age_group, ['Adult', 'Teen']) &&
                            ($freshSlot->age_group === 'Adult' || $freshSlot->age_group === 'Teen'),
                        "Time slot {$freshSlot->id} must be assigned to exactly one age group"
                    );
                }
            });
    }
}
