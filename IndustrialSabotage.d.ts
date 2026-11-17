import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import Action from '@civ-clone/core-unit/Action';
import City from '@civ-clone/core-city/City';
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
export declare class IndustrialSabotage extends Action {
  protected _city: City;
  private _chosenTarget;
  constructor(
    from: Tile,
    to: Tile,
    unit: Unit,
    city: City,
    ruleRegistry?: RuleRegistry
  );
  forUnit(unit: Unit): Action;
  city(): City;
  /** The target chosen when this was performed, one of `targets()`; `undefined` when none was. */
  chosenTarget(): unknown;
  /** What the Diplomat may choose to sabotage: the `MissionTargets` rules' answers. Empty with no rules. */
  targets(): unknown[];
  perform(choice?: unknown): void;
}
export default IndustrialSabotage;
