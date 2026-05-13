import healthConditionData from "../data/health-conditions.json";
import membershipTierData from "../data/membership-tiers.json";
import type { HealthCondition, MembershipTier } from "../types/onboarding";

export const membershipTiers = membershipTierData as MembershipTier[];
export const healthConditions = healthConditionData as HealthCondition[];

export const membershipTierIds = membershipTiers.map((tier) => tier.id);
export const conditionIds = healthConditions.map((condition) => condition.id);

export const noHealthConditionId = "none";
const deferredHealthConditionCategories = ["musculoskeletal", "other", "none"] as const;

export const medicalClearanceConditionIds = healthConditions
  .filter((condition) => condition.requiresMedicalClearance)
  .map((condition) => condition.id);

export function getMembershipTierById(id: string): MembershipTier | undefined {
  return membershipTiers.find((tier) => tier.id === id);
}

export function getHealthConditionById(id: string): HealthCondition | undefined {
  return healthConditions.find((condition) => condition.id === id);
}

export function requiresMedicalClearance(conditionIdsToCheck: string[]): boolean {
  return conditionIdsToCheck.some((conditionId) =>
    medicalClearanceConditionIds.includes(conditionId),
  );
}

export function hasSelectedMedicalConditions(conditionIdsToCheck: string[]): boolean {
  return conditionIdsToCheck.some((conditionId) => conditionId !== noHealthConditionId);
}

export function groupHealthConditionsByCategory(): Record<string, HealthCondition[]> {
  const groupedConditions = healthConditions.reduce<Record<string, HealthCondition[]>>((groups, condition) => {
    groups[condition.category] = groups[condition.category] ?? [];
    groups[condition.category].push(condition);
    return groups;
  }, {});

  return Object.fromEntries(
    Object.entries(groupedConditions).sort(([categoryA], [categoryB]) => {
      const indexA = getDeferredCategoryIndex(categoryA);
      const indexB = getDeferredCategoryIndex(categoryB);

      if (indexA === indexB) {
        return 0;
      }

      return indexA - indexB;
    }),
  );
}

function getDeferredCategoryIndex(category: string): number {
  const deferredIndex = deferredHealthConditionCategories.indexOf(
    category as (typeof deferredHealthConditionCategories)[number],
  );

  return deferredIndex === -1
    ? 0
    : deferredIndex + 1;
}
