import { merge, isFunction } from './utility.js';

/*
 * Notifier - delegates between the client exposed API, the chain of transforms
 * necessary to turn an item into something that can be sent to Rollbar, and the
 * queue which handles the communcation with the Rollbar API servers.
 */
export default class Notifier {
  /**
   *
   * @param {Object} queue - an object that conforms to the interface:
   *    `addItem(item, callback)`
   * @param {Object} options - an object representing the options to be set for
   *    this notifier, this should have any defaults already set by the caller
   */
  constructor(queue, options) {
    this.queue = queue;
    this.options = options;
    this.transforms = [];
    this.diagnostic = {};
  }

  /**
   * configure - updates the options for this notifier with the passed in object
   *
   * @param {Object} options - an object which gets merged with the current
   *    options set on this notifier
   * @returns this
   */
  configure(options) {
    this.queue?.configure(options);
    const oldOptions = this.options;
    this.options = merge(oldOptions, options);
    return this;
  }

  /**
   * Adds a transform onto the end of the queue of transforms for this notifier
   *
   * @param {Function} transform - a function which takes three arguments:
   *    - item: An Object representing the data to eventually be sent to Rollbar
   *    - options: The current value of the options for this notifier
   *    - callback: `function(err: (Null|Error), item: (Null|Object))` the
   *      transform must call this callback with a null value for error if it
   *      wants the processing chain to continue, otherwise with an error to
   *      terminate the processing. The item should be the updated item after
   *      this transform is finished modifying it.
   */
  addTransform(transform) {
    if (isFunction(transform)) {
      this.transforms.push(transform);
    }
    return this;
  }

  /**
   * The internal log function which applies the configured transforms and then
   * pushes onto the queue to be sent to the backend.
   *
   * @param {Object} item - An object with the following structure:
   *    - message [String] - An optional string to be sent to rollbar
   *    - error [Error] - An optional error
   * @param {Function} callback - A function of type `function(err, resp)` which
   *    will be called with exactly one null argument and one non-null argument.
   *    The callback will be called once, either during the transform stage if
   *    an error occurs inside a transform, or in response to the communication
   *    with the backend. The second argument will be the response from the
   *    backend in case of success.
   */
  log(item, callback) {
    callback = isFunction(callback) ? callback : () => {};

    if (!this.options.enabled) {
      return callback(new Error('Rollbar is not enabled'), null);
    }

    this.queue.addPendingItem(item);
    const originalError = item.err;
    this._applyTransforms(item, (err, i) => {
      if (err) {
        this.queue.removePendingItem(item);
        return callback(err, null);
      }
      this.queue.addItem(i, callback, originalError, item);
    });
  }

  /* Internal */

  /**
   * Applies the transforms that have been added to this notifier sequentially.
   * See `addTransform` for more information.
   *
   * @param {Object} item - An item to be transformed
   * @param {Function} callback - A function of type `function(err, item)` which
   *    will be called with a non-null error and a null item in the case of a
   *    transform failure, or a null error and non-null item after all
   *    transforms have been applied.
   */
  _applyTransforms(item, callback) {
    let transformIndex = -1;
    const transformsLength = this.transforms.length;
    const transforms = this.transforms;
    const options = this.options;

    const next = (err, i) => {
      if (err) {
        callback(err, null);
        return;
      }

      transformIndex++;

      if (transformIndex === transformsLength) {
        callback(null, i);
        return;
      }

      transforms[transformIndex](i, options, next);
    };

    next(null, item);
  }
}
