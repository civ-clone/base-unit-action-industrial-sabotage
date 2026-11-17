# base-unit-action-industrial-sabotage

The `IndustrialSabotage` unit action. See civ-clone/web-renderer#58.

## `perform(choice?)`

1. `MissionMode` resolves the escape mode (default `HARD` after a chosen target, `ORDINARY` otherwise). Then a caught
   check (base-unit-agent's `AgentSurvives` with `CAUGHT_CHECK`, given the resolved mode): a Diplomat that is caught
   goes to `AgentLost` and is destroyed by the city's owner, with no `Moved`.
2. The `CitySabotaged(unit, city, action)` rules.
3. `Moved`, then the Diplomat is used up (`AgentLost`, then destroyed as before) unless it survives `AgentSurvives`
   with the resolved mode. A rule that keeps it must spend its moves.

With none of base-unit-agent's rules registered, the Diplomat is always used up, as before.

**Targets:** `targets()` lists what the `MissionTargets` rules offer; `perform(choice)` takes one of them, or its name
(`targetName`), and the rules read it as `action.chosenTarget()`. A choice that isn't offered is ignored.
