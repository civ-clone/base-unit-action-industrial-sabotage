import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import {
  CAUGHT_CHECK,
  HARD,
  ORDINARY,
} from '@civ-clone/base-unit-agent/lib/escape';
import {
  agentSurvives,
  chosenTarget,
  loseAgent,
  missionMode,
  missionTargets,
} from '@civ-clone/base-unit-agent/lib/mission';
import Action from '@civ-clone/core-unit/Action';
import City from '@civ-clone/core-city/City';
import Moved from '@civ-clone/core-unit/Rules/Moved';
import CitySabotaged from './Rules/CitySabotaged';
import Tile from '@civ-clone/core-world/Tile';
import Unit from '@civ-clone/core-unit/Unit';

/**
 * A Diplomat sabotages `city()`. What it destroys is up to the `CitySabotaged` rules, which are given the action, so
 * they can read `chosenTarget()`.
 *
 * `perform(choice?)`, in order (base-unit-agent's seams; with none of their rules registered, only steps 2 and 3 do
 * anything, as before they existed):
 * 1. `MissionMode` resolves the escape mode (default `HARD` for a chosen target, `ORDINARY` otherwise); then the
 *    Diplomat must survive a caught check (`AgentSurvives` with `CAUGHT_CHECK`, given the resolved mode): one that is
 *    caught goes to `AgentLost` and is destroyed by the city's owner, with no `Moved`;
 * 2. the `CitySabotaged` rules;
 * 3. `Moved`, then the Diplomat is used up (`AgentLost`, then destroyed) unless it survives `AgentSurvives` with the
 *    resolved mode.
 *
 * `choice` is one of `targets()` (the `MissionTargets` rules' answers), or its name. A choice that isn't among them is
 * ignored, so with no `MissionTargets` rules there's never a choice.
 */
export class IndustrialSabotage extends Action {
  protected _city: City;
  // Declared, never initialised, so an action that was never given a choice has no field for it.
  private declare _chosenTarget: unknown;

  constructor(
    from: Tile,
    to: Tile,
    unit: Unit,
    city: City,
    ruleRegistry: RuleRegistry = ruleRegistryInstance
  ) {
    super(from, to, unit, ruleRegistry);

    this._city = city;
  }

  // `Action.forUnit` rebuilds an action from `(from, to, unit, ruleRegistry)`, which would put the `RuleRegistry` where
  // the `City` goes.
  // Typed as `Action`: a subclass with a member of its own isn't assignable to it (civ-clone/web-renderer#21).
  forUnit(unit: Unit): Action {
    return new IndustrialSabotage(
      this.from(),
      this.to(),
      unit,
      this._city,
      this.ruleRegistry()
    ) as unknown as Action;
  }

  city(): City {
    return this._city;
  }

  /** The target chosen when this was performed, one of `targets()`; `undefined` when none was. */
  chosenTarget(): unknown {
    return this._chosenTarget;
  }

  /** What the Diplomat may choose to sabotage: the `MissionTargets` rules' answers. Empty with no rules. */
  targets(): unknown[] {
    return missionTargets(
      this.unit(),
      this._city,
      this as unknown as Action,
      this.ruleRegistry()
    );
  }

  perform(choice?: unknown): void {
    const unit = this.unit(),
      mission = this as unknown as Action,
      ruleRegistry = this.ruleRegistry(),
      target =
        choice === undefined ? undefined : chosenTarget(choice, this.targets());

    if (target !== undefined) {
      this._chosenTarget = target;
    }

    const mode = missionMode(
      unit,
      mission,
      target === undefined ? ORDINARY : HARD,
      ruleRegistry
    );

    if (
      !agentSurvives(unit, mission, CAUGHT_CHECK, ruleRegistry, undefined, mode)
    ) {
      loseAgent(
        unit,
        this._city,
        mission,
        true,
        ruleRegistry,
        this._city.player()
      );

      return;
    }

    ruleRegistry.process(CitySabotaged, unit, this._city, this);

    ruleRegistry.process(Moved, unit, mission);

    if (!agentSurvives(unit, mission, mode, ruleRegistry)) {
      loseAgent(unit, this._city, mission, false, ruleRegistry);
    }
  }
}

export default IndustrialSabotage;
