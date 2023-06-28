import { overrides } from './environment.development';
import { ENVIRONMENT_DEFAULTS, Environment } from './environment.model';

export const environment: Environment = {
  ...ENVIRONMENT_DEFAULTS,

  icmChannel: 'inSPIRED-inTRONICS_Business-Site',

  themeColor: '#688dc3',

  //sparque: {
  //  endPoint: 'search/4/testintershop/api/PWA',
  //},

  features: [
    ...ENVIRONMENT_DEFAULTS.features,
    'businessCustomerRegistration',
    'costCenters',
    'maps',
    'messageToMerchant',
    'punchout',
    'quickorder',
    'quoting',
    'orderTemplates',
    'sparque',
  ],

  ...overrides,
};
