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
    this.config = config || {};
    this.triggers = this._triggersWithDefaults(config);

    this.predicates = {
      occurrence: [this.isLevelMatching.bind(this), this.isSampled.bind(this)],
      navigation: [this.isPathMatching.bind(this), this.isSampled.bind(this)],
      direct: [this.isTagMatching.bind(this), this.isSampled.bind(this)],
    };
  }

  _triggersWithDefaults(config) {
    const triggers = config?.triggers || [];
    return triggers.map((t) => ({ ...config.triggerDefaults, ...t }));
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
   * @param {Object} trigger - The trigger object containing the pathMatch regex.
   * @return {boolean} - True if the trigger's pathMatch matches the context item's path, false otherwise.
   */
  isPathMatching(trigger, context) {
    if (!trigger.pathMatch) return true;

    if (context.path?.match(new RegExp(trigger.pathMatch))) {
      return true;
    }

    return false;
  }

  /**
   * isTagMatching - Checks if the trigger's tags match any of the context item's tags.
   * If no tags are specified in the trigger, it defaults to matching all tags.
   * @param {Object} trigger - The trigger object containing the tags.
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
