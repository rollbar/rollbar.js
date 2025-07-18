// rollbar.js
import Rollbar from 'rollbar';
import config from './rollbar.config';

const rollbar = new Rollbar(config);

export default {
  install(app) {
    app.config.errorHandler = (error, vm, info) => {

      // In case the error is from the router or am helper
      // calling vm could generate a loop and freeze the browser
      // rollbar.error(error, { vueComponent: vm, info });

      rollbar.error(error, { info });

      if (app.config.devtools) console.error(error);
    }

    app.config.warningHandler = (error, vm, info) => {
      rollbar.warning(error, { info });

      if (app.config.devtools) console.log('just a warning, but!', error);
    }

    app.provide('rollbar', rollbar);
  },
};
