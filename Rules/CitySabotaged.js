"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CitySabotaged = void 0;
const Rule_1 = require("@civ-clone/core-rule/Rule");
/**
 * Processed when a Diplomat (`Unit`) sabotages `City`, by the `IndustrialSabotage` action, whose `chosenTarget()` is
 * what the player chose to sabotage, if anything (a caller outside the action may leave it out); before the Diplomat is
 * used up, unless it survives.
 */
class CitySabotaged extends Rule_1.default {
}
exports.CitySabotaged = CitySabotaged;
exports.default = CitySabotaged;
//# sourceMappingURL=CitySabotaged.js.map