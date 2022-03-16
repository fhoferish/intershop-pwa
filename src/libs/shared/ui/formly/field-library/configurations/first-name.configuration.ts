import { Injectable } from '@angular/core';
import { SpecialValidators } from '@intershop-pwa/formly/validators/special-validators';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { FieldLibraryConfiguration } from './field-library-configuration';

/**
 * First name, special characters forbidden and required by default
 */
@Injectable()
export class FirstNameConfiguration extends FieldLibraryConfiguration {
  id = 'firstName';

  getFieldConfig(): FormlyFieldConfig {
    return {
      type: 'ish-text-input-field',
      templateOptions: {
        label: 'account.default_address.firstname.label',
        required: true,
      },
      validators: {
        validation: [SpecialValidators.noSpecialChars],
      },
      validation: {
        messages: {
          required: 'account.address.firstname.missing.error',
          noSpecialChars: 'account.name.error.forbidden.chars',
        },
      },
    };
  }
}