import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import Action from '@civ-clone/core-unit/Action';
import City from '@civ-clone/core-city/City';
import Moved from '@civ-clone/core-unit/Rules/Moved';
import CitySabotaged from './Rules/CitySabotaged';
import Tile from '@civ-clone/core-world/Tile';
import Unit from '@civ-clone/core-unit/Unit';

/** A Diplomat sabotages `city()`. What it destroys is up to the `CitySabotaged` rules. The Diplomat is used up. */
export class IndustrialSabotage extends Action {
  protected _city: City;

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

  perform(): void {
    this.ruleRegistry().process(CitySabotaged, this.unit(), this._city);

    this.ruleRegistry().process(Moved, this.unit(), this as unknown as Action);

    this.unit().destroy();
  }
}

export default IndustrialSabotage;
