# Angular 2+ Rollbar Integration

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.6,
and has been modified to demonstrate integration of rollbar.js into Angular 2+ apps.

All the functionality of rollbar.js is available within Angular, including global capture
of errors, and logging and telemetry.

## Rollbar configuration

The rollbar integration is primarily contained in src/app/rollbar.ts. The rollbar
configuration object is also located here, and should be updated with your settings.

The two provider services are added to the app in src/app/app.module.ts.

Use from within a component is demonstrated in src/app/component.ts.

## Node modules

Run 'npm install` to install node modules.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Preparing for rollbar.js tests

Rollbar.js test automation includes tests that load and exercise this example app.
For those tests to work, the Angular AOT files must be available and up to date in ./examples/angular2/dist/.
If the example app has changed or changes to rollbar.js need to be pulled in,
update and commit new AOT files.

```
# Build the rollbar.js dist if needed.
npm run build

# Prepare the example's npm bundle.
cd examples/angular2 && npm install

# Build the AOT files with custom deployUrl.
ng build --aot --deployUrl="/examples/angular2/dist/my-app/"

# The rollbar.js dist is no longer needed, and can be reverted.
cd ../.. && git checkout dist
```

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
