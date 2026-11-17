import City from '@civ-clone/core-city/City';
import type IndustrialSabotage from '../IndustrialSabotage';
import Rule from '@civ-clone/core-rule/Rule';
import Unit from '@civ-clone/core-unit/Unit';
/**
 * Processed when a Diplomat (`Unit`) sabotages `City`, by the `IndustrialSabotage` action, whose `chosenTarget()` is
 * what the player chose to sabotage, if anything (a caller outside the action may leave it out); before the Diplomat is
 * used up, unless it survives.
 */
export declare class CitySabotaged extends Rule<
  [Unit, City, IndustrialSabotage?],
  void
> {}
export default CitySabotaged;
