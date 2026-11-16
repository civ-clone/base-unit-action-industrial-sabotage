# base-unit-action-industrial-sabotage

The `IndustrialSabotage` unit action. See civ-clone/web-renderer#58.

## `perform(choice?)`

1. A caught check (base-unit-agent's `AgentSurvives` with `CAUGHT_CHECK`): a Diplomat that is caught is destroyed,
   after the `Moved` rules.
2. The `CitySabotaged(unit, city, action)` rules.
3. `Moved`, then the Diplomat is used up unless it survives (`AgentSurvives`: `HARD` after a chosen target,
   `ORDINARY` otherwise).

With none of base-unit-agent's rules registered, the Diplomat is always used up, as before.

**Targets:** `targets()` lists what the `MissionTargets` rules offer; `perform(choice)` takes one of them, or its name
(`targetName`), and the rules read it as `action.chosenTarget()`. A choice that isn't offered is ignored.
