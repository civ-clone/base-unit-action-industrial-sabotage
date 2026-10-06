"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndustrialSabotage = void 0;
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const Action_1 = require("@civ-clone/core-unit/Action");
const Moved_1 = require("@civ-clone/core-unit/Rules/Moved");
const CitySabotaged_1 = require("./Rules/CitySabotaged");
/** A Diplomat sabotages `city()`. What it destroys is up to the `CitySabotaged` rules. The Diplomat is used up. */
class IndustrialSabotage extends Action_1.default {
    constructor(from, to, unit, city, ruleRegistry = RuleRegistry_1.instance) {
        super(from, to, unit, ruleRegistry);
        this._city = city;
    }
    // `Action.forUnit` rebuilds an action from `(from, to, unit, ruleRegistry)`, which would put the `RuleRegistry` where
    // the `City` goes.
    // Typed as `Action`: a subclass with a member of its own isn't assignable to it (civ-clone/web-renderer#21).
    forUnit(unit) {
        return new IndustrialSabotage(this.from(), this.to(), unit, this._city, this.ruleRegistry());
    }
    perform() {
        this.ruleRegistry().process(CitySabotaged_1.default, this.unit(), this._city);
        this.ruleRegistry().process(Moved_1.default, this.unit(), this);
        this.unit().destroy();
    }
}
exports.IndustrialSabotage = IndustrialSabotage;
exports.default = IndustrialSabotage;
//# sourceMappingURL=IndustrialSabotage.js.map