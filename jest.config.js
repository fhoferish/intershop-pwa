const esModules = ['lodash-es/.*', 'swiper', 'ssr-window', 'dom7', '.*\\.mjs$'];

module.exports = {
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
  preset: 'jest-preset-angular',
  testRunner: 'jest-jasmine2',
  maxWorkers: process.env.JEST_MAX_WORKERS || '75%', // keep some cpu for moving the mouse
  roots: ['src', 'projects'],
  setupFilesAfterEnv: ['<rootDir>/src/setupJest.ts'],
  transformIgnorePatterns: [`node_modules/(?!${esModules.join('|')})`],
  moduleNameMapper: {
    '^ish-(.*)$': '<rootDir>/src/app/$1',
    '^organization-management$': '<rootDir>/projects/organization-management/src/app/exports',
    '^requisition-management$': '<rootDir>/projects/requisition-management/src/app/exports',
    // This forces jest to use a Node+CommonJS version of uuid. Refer to the following resources for more info:
    // https://github.com/uuidjs/uuid/pull/616
    // https://github.com/microsoft/accessibility-insights-web/pull/5421#issuecomment-1109168149
    '^uuid$': require.resolve('uuid'),
  },
  snapshotSerializers: [
    './src/jest-serializer/AngularHTMLSerializer.js',
    './src/jest-serializer/CategoryTreeSerializer.js',
    './src/jest-serializer/NgrxActionSerializer.js',
    './src/jest-serializer/NgrxActionArraySerializer.js',
  ],
};
