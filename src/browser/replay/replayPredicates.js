
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
   * @param {Object} context - Context object containing state used by predicates.
   */
  constructor(config, context) {
    this.config = config || {};
    this.triggers = config?.triggers || [];
    this.context = context || {};

    this.predicates = {
      occurrence: [
        this.isLevelMatching.bind(this),
        this.isSampled.bind(this),
      ],
    };
  }

  /**
   * isEnabledForTriggerType - Checks if replay is enabled for a given trigger type.
   * Applies all predicates for that trigger type and returns true if all predicates pass
   * for any matching trigger.
   *
   * @param {string} triggerType - The type of the trigger to check.
   * @returns {boolean} - True if replay is enabled for the trigger type, false otherwise.
   */
  isEnabledForTriggerType(triggerType) {
    const predicates = this.predicates[triggerType];

    for (const t of this.triggers) {
      if (t.type === triggerType && this.isEnabledForTrigger(t, predicates)) {
        return true;
      }
    }

    return false;
  }

  isEnabledForTrigger(trigger, predicates) {
    if (predicates.find(p => !p(trigger))) {
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
  isLevelMatching(trigger) {
    if (!trigger.level || trigger.level?.includes(this.context?.item?.level)) {
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
  isSampled(trigger) {
    const ratio = trigger.samplingRatio || this.config.baseSamplingRatio || 1;

    if (ratio == 1) {
      return true;
    }
    const rv = this.context.replayId.slice(-14);
    const th = (this.maxAdjustedCount * (1 - ratio)).toString(16).padStart(14, '0');

    return rv >= th;
  }
}
