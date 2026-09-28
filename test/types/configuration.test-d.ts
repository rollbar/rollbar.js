// Compile-time checks for the public types in index.d.ts, run by
// `npm run typecheck:tests`. Nothing here is executed.
import Rollbar from 'rollbar';

// True only when A and B are the same type. Unlike a plain assignment check,
// this fails if either side is `any`, which tsconfig's `strict: false` would
// otherwise let through.
type Equals<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : false;

type HookArgs<K extends 'checkIgnore' | 'onSendCallback'> = Parameters<
  NonNullable<Rollbar.Configuration[K]>
>[1];

// https://github.com/rollbar/rollbar.js/issues/1150
// checkIgnore/onSendCallback receive a real array at runtime (see
// userCheckIgnore in src/predicates.js), so the type must stay an array.
const _checkIgnoreArgs: Equals<
  HookArgs<'checkIgnore'>,
  Rollbar.LogArgument[]
> = true;
const _onSendCallbackArgs: Equals<
  HookArgs<'onSendCallback'>,
  Rollbar.LogArgument[]
> = true;

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
