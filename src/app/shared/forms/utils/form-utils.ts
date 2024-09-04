import { FormGroup } from '@angular/forms';

/**
 * Marks all fields in a form group as dirty recursively (i.e. for nested form groups also)
 *
 * @param formGroup The form group
 */
export function markAsDirtyRecursive(formGroup: FormGroup) {
  Object.keys(formGroup.controls).forEach(key => {
    if (formGroup.controls[key] instanceof FormGroup) {
      markAsDirtyRecursive(formGroup.controls[key] as FormGroup);
    } else {
      formGroup.controls[key].markAsDirty();
      formGroup.controls[key].updateValueAndValidity();
    }
  });
}

// TODO: use "get ariaDescribedByIds()" in every form type component or create a BaseFieldComponent?
/**
 * Returns the value for the aria-describedby attribute.
 * This is used to link the input field to the error message and / or the description separated by white space.
 * The IDs are generated based on the field ID.
 *
 * @param id The ID of the form field.
 * @param showError A boolean indicating whether to show the error message.
 * @param customDescription A optional boolean indicating whether there is a custom description.
 * @returns The value as a string or undefined if no IDs are present.
 */
export function ariaDescribedByIds(id: string, showError: boolean, customDescription: boolean = false): string | null {
  const errorId = showError ? `${id}-formly-validation-error` : '';
  const descriptionId = customDescription ? `${id}-formly-description` : '';

  const describedByIds = [errorId, descriptionId].filter(Boolean).join(' ');

  return describedByIds || undefined;
}

/**
 * Set focus on the first invalid field in a form.
 *
 * @param form The form group to check for invalid fields.
 */
export function focusFirstInvalidField(form: FormGroup) {
  for (const key of Object.keys(form.controls)) {
    const control = form.get(key);

    if (control && control.invalid) {
      if (control instanceof FormGroup) {
        // recursively check nested FormGroup
        focusFirstInvalidField(control);
      } else {
        const element = document.querySelector(`[id^='formly_'][id*='${key}']`);

        if (
          element &&
          (element instanceof HTMLInputElement ||
            element instanceof HTMLSelectElement ||
            element instanceof HTMLTextAreaElement)
        ) {
          (element as HTMLElement).focus();
          // break after the first element is focused
          break;
        }
      }
    }
  }
}
