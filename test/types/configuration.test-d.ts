// Compile-time checks for the public types in index.d.ts, run by
// `npm run typecheck:tests`. Nothing here is executed.
import Rollbar from 'rollbar';

// https://github.com/rollbar/rollbar.js/issues/1150
// checkIgnore/onSendCallback receive a real array at runtime (see
// createItem in src/utility.js), so array methods must type-check.
const config: Rollbar.Configuration = {
  checkIgnore: (_isUncaught, args, _item) =>
    args.some((arg) => arg instanceof Error),
  onSendCallback: (_isUncaught, args, _item) => {
    args.forEach((_arg) => {});
  },
};

const args: Rollbar.LogArgument[] = [];
config.checkIgnore?.(false, args, {});
config.onSendCallback?.(false, args, {});
