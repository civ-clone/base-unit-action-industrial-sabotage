import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import Action from '@civ-clone/core-unit/Action';
import City from '@civ-clone/core-city/City';
import Tile from '@civ-clone/core-world/Tile';
import Unit from '@civ-clone/core-unit/Unit';
/** A Diplomat sabotages `city()`. What it destroys is up to the `CitySabotaged` rules. The Diplomat is used up. */
export declare class IndustrialSabotage extends Action {
  protected _city: City;
  constructor(
    from: Tile,
    to: Tile,
    unit: Unit,
    city: City,
    ruleRegistry?: RuleRegistry
  );
  forUnit(unit: Unit): Action;
  perform(): void;
}
export default IndustrialSabotage;
