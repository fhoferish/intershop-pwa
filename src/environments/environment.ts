// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  platformId: '',
  production: true,
  needMock: false,
  mustMockPaths: [
    //   'categories/Specials'
  ],
  rest_url: 'http://10.131.60.97:9091/INTERSHOP/rest/WFS/inSPIRED-inTRONICS-Site/-',
  base_url: 'http://10.131.60.97:9091',

  locales: [
    { 'lang': 'en_US', 'currency': 'USD', value: 'English', displayValue: 'en' },
    { 'lang': 'de_DE', 'currency': 'EUR', value: 'German', displayValue: 'de' }
  ],
  prefix: 'ROUTES',
  pattern: '{LANG}/{CURRENCY}'
};
