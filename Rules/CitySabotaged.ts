import City from '@civ-clone/core-city/City';
import Rule from '@civ-clone/core-rule/Rule';
import Unit from '@civ-clone/core-unit/Unit';

/** Processed when a Diplomat (`Unit`) sabotages `City`, before it's used up. */
export class CitySabotaged extends Rule<[Unit, City], void> {}

export default CitySabotaged;
