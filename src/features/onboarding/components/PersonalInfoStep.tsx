import { useFormContext } from "react-hook-form";
import { FormField } from "../../../components/ui/FormField";
import { Input } from "../../../components/ui/Input";
import type { OnboardingFormValuesInput } from "../schemas/onboardingSchema";

export function PersonalInfoStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<OnboardingFormValuesInput>();

  return (
    <div className="space-y-8">
      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="sr-only">Personal details</legend>
        <FormField
          id="firstName"
          label="First name"
          error={errors.personal?.firstName?.message}
        >
          <Input
            id="firstName"
            autoComplete="given-name"
            hasError={Boolean(errors.personal?.firstName)}
            aria-describedby={
              errors.personal?.firstName ? "firstName-error" : undefined
            }
            {...register("personal.firstName")}
          />
        </FormField>

        <FormField
          id="lastName"
          label="Last name"
          error={errors.personal?.lastName?.message}
        >
          <Input
            id="lastName"
            autoComplete="family-name"
            hasError={Boolean(errors.personal?.lastName)}
            aria-describedby={
              errors.personal?.lastName ? "lastName-error" : undefined
            }
            {...register("personal.lastName")}
          />
        </FormField>

        <FormField
          id="dateOfBirth"
          label="Date of birth"
          hint="Members must be at least 16."
          error={errors.personal?.dateOfBirth?.message}
        >
          <Input
            id="dateOfBirth"
            type="date"
            autoComplete="bday"
            hasError={Boolean(errors.personal?.dateOfBirth)}
            aria-describedby={
              errors.personal?.dateOfBirth
                ? "dateOfBirth-error"
                : "dateOfBirth-hint"
            }
            {...register("personal.dateOfBirth")}
          />
        </FormField>

        <FormField
          id="phone"
          label="Mobile number"
          hint="Use 04XXXXXXXX, +614XXXXXXXX, or 614XXXXXXXX."
          error={errors.personal?.phone?.message}
        >
          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            hasError={Boolean(errors.personal?.phone)}
            aria-describedby={
              errors.personal?.phone ? "phone-error" : "phone-hint"
            }
            {...register("personal.phone")}
          />
        </FormField>
      </fieldset>

      <fieldset className="grid gap-5 sm:grid-cols-6">
        <legend className="mb-1 text-sm font-bold uppercase tracking-wide text-brand-700">
          Address
        </legend>
        <FormField
          id="addressLine1"
          label="Address line 1"
          error={errors.address?.line1?.message}
          className="sm:col-span-6"
        >
          <Input
            id="addressLine1"
            autoComplete="address-line1"
            hasError={Boolean(errors.address?.line1)}
            aria-describedby={
              errors.address?.line1 ? "addressLine1-error" : undefined
            }
            {...register("address.line1")}
          />
        </FormField>

        <FormField
          id="addressLine2"
          label="Address line 2"
          hint="Optional"
          error={errors.address?.line2?.message}
          className="sm:col-span-6"
        >
          <Input
            id="addressLine2"
            autoComplete="address-line2"
            hasError={Boolean(errors.address?.line2)}
            aria-describedby={
              errors.address?.line2 ? "addressLine2-error" : "addressLine2-hint"
            }
            {...register("address.line2")}
          />
        </FormField>

        <FormField
          id="city"
          label="Suburb or city"
          error={errors.address?.city?.message}
          className="sm:col-span-3"
        >
          <Input
            id="city"
            autoComplete="address-level2"
            hasError={Boolean(errors.address?.city)}
            aria-describedby={errors.address?.city ? "city-error" : undefined}
            {...register("address.city")}
          />
        </FormField>

        <FormField
          id="state"
          label="State"
          error={errors.address?.state?.message}
          className="sm:col-span-1"
        >
          <Input
            id="state"
            autoComplete="address-level1"
            hasError={Boolean(errors.address?.state)}
            aria-describedby={errors.address?.state ? "state-error" : undefined}
            {...register("address.state")}
          />
        </FormField>

        <FormField
          id="postcode"
          label="Postcode"
          error={errors.address?.postcode?.message}
          className="sm:col-span-2"
        >
          <Input
            id="postcode"
            autoComplete="postal-code"
            inputMode="numeric"
            hasError={Boolean(errors.address?.postcode)}
            aria-describedby={
              errors.address?.postcode ? "postcode-error" : undefined
            }
            {...register("address.postcode")}
          />
        </FormField>

        <FormField
          id="country"
          label="Country"
          error={errors.address?.country?.message}
          className="sm:col-span-6"
        >
          <Input
            id="country"
            autoComplete="country-name"
            hasError={Boolean(errors.address?.country)}
            aria-describedby={
              errors.address?.country ? "country-error" : undefined
            }
            {...register("address.country")}
          />
        </FormField>
      </fieldset>

      <fieldset className="grid gap-5 sm:grid-cols-3">
        <legend className="mb-1 text-sm font-bold uppercase tracking-wide text-brand-700">
          Emergency contact
        </legend>
        <FormField
          id="emergencyName"
          label="Emergency contact name"
          error={errors.emergencyContact?.name?.message}
        >
          <Input
            id="emergencyName"
            autoComplete="name"
            hasError={Boolean(errors.emergencyContact?.name)}
            aria-describedby={
              errors.emergencyContact?.name ? "emergencyName-error" : undefined
            }
            {...register("emergencyContact.name")}
          />
        </FormField>

        <FormField
          id="emergencyRelationship"
          label="Relationship"
          error={errors.emergencyContact?.relationship?.message}
        >
          <Input
            id="emergencyRelationship"
            hasError={Boolean(errors.emergencyContact?.relationship)}
            aria-describedby={
              errors.emergencyContact?.relationship
                ? "emergencyRelationship-error"
                : undefined
            }
            {...register("emergencyContact.relationship")}
          />
        </FormField>

        <FormField
          id="emergencyPhone"
          label="Emergency mobile number"
          error={errors.emergencyContact?.phone?.message}
        >
          <Input
            id="emergencyPhone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            hasError={Boolean(errors.emergencyContact?.phone)}
            aria-describedby={
              errors.emergencyContact?.phone
                ? "emergencyPhone-error"
                : undefined
            }
            {...register("emergencyContact.phone")}
          />
        </FormField>
      </fieldset>
    </div>
  );
}
