/**
 * ReplayPredicates - Determine if replay is enabled for a given trigger type.
 *
 */
export default class ReplayPredicates {
  maxAdjustedCount = 2 ** 56;

  /*
   * Constructor for ReplayPredicates.
   *
   * @param {Object} config - Configuration object containing replay settings.
   */
  constructor(config) {
    this.configure(config);

    this.predicates = {
      occurrence: [
        this.isLevelMatching.bind(this),
        this.isPredicateFnMatching.bind(this),
        this.isSampled.bind(this),
      ],
      navigation: [
        this.isPathMatching.bind(this),
        this.isPredicateFnMatching.bind(this),
        this.isSampled.bind(this),
      ],
      direct: [
        this.isTagMatching.bind(this),
        this.isPredicateFnMatching.bind(this),
        this.isSampled.bind(this),
      ],
    };
  }

  configure(config) {
    this.config = config || {};
    this.triggers = this._triggersWithDefaults(config);
    this.maxPreDuration = this._maxPreDuration();
  }

  _triggersWithDefaults(config) {
    const triggers = config?.triggers || [];
    return triggers.map((t) => ({ ...config.triggerDefaults, ...t }));
  }

  _maxPreDuration() {
    if (!this.triggers) return 0;

    return Math.max(...this.triggers.map((t) => t.preDuration || 0), 0);
  }

  /**
   * shouldCaptureForTriggerContext - Checks if replay is enabled for a given trigger type.
   * Applies all predicates for that trigger type and returns true if all predicates pass
   * for any matching trigger.
   *
   * @param {Object} context - Context object containing state used by predicates.
   * @return {Object} - The first matching trigger if enabled, otherwise null.
   */
  shouldCaptureForTriggerContext(context) {
    const predicates = this.predicates[context.type];

    for (const t of this.triggers) {
      if (
        t.type === context.type &&
        this.isEnabledForTrigger(t, predicates, context)
      ) {
        return t;
      }
    }

    return null;
  }

  isEnabledForTrigger(trigger, predicates, context) {
    if (predicates.find((p) => !p(trigger, context))) {
      return false;
    }

    return true;
  }

  /**
   * isLevelMatching - Checks if the trigger's level matches the context item's level.
   * If no level is specified in the trigger, it defaults to matching all levels.
   * @param {Object} trigger - The trigger object containing the level.
   * @param {Object} context - The context object containing state for the trigger to match.
   * @return {boolean} - True if the trigger's level matches the context item's level, false otherwise.
   */
  isLevelMatching(trigger, context) {
    if (!trigger.level || trigger.level.includes(context.level)) {
      return true;
    }
    return false;
  }

  /**
   * isPathMatching - Checks if the trigger's pathMatch regex matches the context item's path.
   * If no pathMatch is specified in the trigger, it defaults to matching all paths.
   * @param {Object} trigger - The trigger object containing the pathMatch regex or string.
   * @param {Object} context - The context object containing state for the trigger to match.
   * @return {boolean} - True if no trigger or the trigger's pathMatch matches the context item's path, false otherwise.
   */
  isPathMatching(trigger, context) {
    const path = context.path;
    const pathMatch = trigger.pathMatch;

    if (!pathMatch) return true;
    if (!path) return false;

    if (typeof pathMatch === 'string') {
      if (path.includes(pathMatch)) {
        return true;
      }
    } else {
      if (path.match(pathMatch)) {
        return true;
      }
    }
    return false;
  }

  /**
   * isTagMatching - Checks if the trigger's tags match any of the context item's tags.
   * If no tags are specified in the trigger, it defaults to matching all tags.
   * @param {Object} trigger - The trigger object containing the tags.
   * @param {Object} context - The context object containing state for the trigger to match.
   * @return {boolean} - True if the trigger's tags match any of the context item's tags, false otherwise.
   */
  isTagMatching(trigger, context) {
    if (!trigger.tags) return true;

    if (context.tags?.some((t) => trigger.tags.includes(t))) {
      return true;
    }

    return false;
  }

  /**
   * isPredicateFnMatching - Checks if the trigger's custom predicate function returns true.
   * If no predicate function is specified in the trigger, it defaults to true.
   * @param {Object} trigger - The trigger object containing the predicate function.
   * @param {Object} context - The context object containing state for the trigger to match.
   * @return {boolean} - True if the trigger's predicate function returns true, false otherwise.
   */
  isPredicateFnMatching(trigger, context) {
    console.log('isPredicateFnMatching', trigger, context);
    if (typeof trigger.predicateFn !== 'function') return true;

    return trigger.predicateFn(trigger, context);
  }

  /**
   * isSampled - Determines if the trigger should be sampled based on its sampling ratio.
   * If no ratio is specified, defaults to 1 (always sampled).
   *
   * Sampling algorithm is based on OTel probability sampling as described in
   * * https://opentelemetry.io/docs/specs/otel/trace/tracestate-probability-sampling/
   * * https://opentelemetry.io/docs/specs/otel/trace/tracestate-handling/
   *
   * Note: String compare is more performant than conversion to float,
   * assuming the `th` calculation will be moved to the trigger configuration.
   * This allows `toString` to be called once, rather than `parseInt` to be called on
   * each replay.
   *
   * @param {Object} trigger - The trigger object containing the sampling ratio.
   * @param {Object} context - The context object containing the replayId.
   * @returns {boolean} - True if the trigger is sampled, false otherwise.
   */
  isSampled(trigger, context) {
    const ratio = trigger.samplingRatio ?? 1;

    if (ratio == 1) {
      return true;
    }
    const rv = context.replayId.slice(-14);
    const th = (this.maxAdjustedCount * (1 - ratio))
      .toString(16)
      .padStart(14, '0');

    return rv >= th;
  }
}
