import City from '@civ-clone/core-city/City';
import AgentSurvives from '@civ-clone/base-unit-agent/Rules/AgentSurvives';
import MissionTargets from '@civ-clone/base-unit-agent/Rules/MissionTargets';
import Destroyed from '@civ-clone/core-unit/Rules/Destroyed';
import Effect from '@civ-clone/core-rule/Effect';
import CitySabotaged from '../Rules/CitySabotaged';
import IndustrialSabotage from '../IndustrialSabotage';
import Moved from '@civ-clone/core-unit/Rules/Moved';
import Player from '@civ-clone/core-player/Player';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Terrain from '@civ-clone/core-terrain/Terrain';
import Tile from '@civ-clone/core-world/Tile';
import Unit from '@civ-clone/core-unit/Unit';
import UnitAction from '@civ-clone/core-unit/Action';
import World from '@civ-clone/core-world/World';
import { EscapeMode } from '@civ-clone/base-unit-agent/lib/escape';
import { expect } from 'chai';

class Diplomat extends Unit {}

export const setUp = (answer: boolean | null) => {
  const ruleRegistry = new RuleRegistry(),
    tile = (x: number): Tile =>
      new Tile(x, 0, new Terrain(), null as unknown as World, ruleRegistry),
    player = new Player(),
    host = new Player(),
    from = tile(0),
    to = tile(1),
    city = { player: () => host, tile: () => to } as unknown as City,
    unit = new Diplomat(null, player, from, ruleRegistry),
    log: string[] = [],
    chosen: unknown[] = [];

  ruleRegistry.register(
    new Moved(
      new Effect((moved: Unit, action: UnitAction): void => {
        log.push(
          `moved ${moved === unit} ${action instanceof IndustrialSabotage}`
        );
      })
    ),
    new Destroyed(
      new Effect((destroyed: Unit, by: Player | null): void => {
        log.push(
          `destroyed ${destroyed === unit} ${
            by === null ? null : by === host ? 'host' : 'other'
          }`
        );
      })
    )
  );

  if (answer !== null) {
    ruleRegistry.register(
      new CitySabotaged(
        new Effect((by: Unit, at: City, action?: IndustrialSabotage): void => {
          log.push(`sabotaged ${by === unit} ${at === city}`);
          chosen.push(action?.chosenTarget());
        })
      )
    );
  }

  const action = new IndustrialSabotage(from, to, unit, city, ruleRegistry);

  return { action, chosen, city, from, log, ruleRegistry, to, unit };
};

describe('IndustrialSabotage', (): void => {
  it('always uses the Diplomat up: the rules, then `Moved`, then destroyed by no one', (): void => {
    const { action, log, unit } = setUp(true);

    action.perform();

    expect(log).to.deep.equal([
      'sabotaged true true',
      'moved true true',
      'destroyed true null',
    ]);
  });

  it('uses the Diplomat up with no rules too', (): void => {
    const none = setUp(null);

    none.action.perform();

    expect(none.log).to.deep.equal(['moved true true', 'destroyed true null']);
  });

  it('rebuilds itself for another unit with the same city and rule registry', (): void => {
    const { action, city, ruleRegistry, unit } = setUp(true),
      other = new Diplomat(null, unit.player(), unit.tile(), ruleRegistry),
      rebuilt = action.forUnit(other) as unknown as IndustrialSabotage;

    expect(rebuilt).to.instanceOf(IndustrialSabotage);
    expect(rebuilt.unit()).to.equal(other);
    expect(rebuilt.city()).to.equal(city);
    expect(rebuilt.ruleRegistry()).to.equal(ruleRegistry);
  });

  describe('with `AgentSurvives` rules', (): void => {
    const survives = (
      set: ReturnType<typeof setUp>,
      answer: (mode: EscapeMode) => boolean
    ): void => {
      set.ruleRegistry.register(
        new AgentSurvives(
          new Effect((unit: Unit, mission: UnitAction, mode: EscapeMode) => {
            set.log.push(
              `asked ${unit === set.unit} ${mission === set.action} ${mode}`
            );

            return answer(mode);
          })
        )
      );
    };

    it('keeps a Diplomat that survives, after a caught check before the mission and an ordinary one after', (): void => {
      const set = setUp(true);

      survives(set, (): boolean => true);
      set.action.perform();

      expect(set.log).to.deep.equal([
        'asked true true -1',
        'sabotaged true true',
        'moved true true',
        'asked true true 0',
      ]);
    });

    it("destroys a Diplomat that is caught before the mission, by the city's owner, with no `Moved`", (): void => {
      const set = setUp(true);

      survives(set, (mode: EscapeMode): boolean => mode !== -1);
      set.action.perform();

      expect(set.log).to.deep.equal([
        'asked true true -1',
        'destroyed true host',
      ]);
    });

    it('destroys a Diplomat that does not escape, after the mission', (): void => {
      const set = setUp(true);

      survives(set, (mode: EscapeMode): boolean => mode === -1);
      set.action.perform();

      expect(set.log).to.deep.equal([
        'asked true true -1',
        'sabotaged true true',
        'moved true true',
        'asked true true 0',
        'destroyed true null',
      ]);
    });
  });

  describe('targets', (): void => {
    class Temple {}

    const withTargets = (set: ReturnType<typeof setUp>): void => {
      set.ruleRegistry.register(
        new MissionTargets(new Effect((): unknown[] => [Temple, 'production']))
      );
    };

    it('offers nothing with no `MissionTargets` rules, and ignores a choice', (): void => {
      const set = setUp(true);

      expect(set.action.targets()).to.deep.equal([]);

      set.action.perform('Temple');

      expect(set.chosen).to.deep.equal([undefined]);
    });

    it("hands the rules the player's choice, and asks for a hard escape after it", (): void => {
      const set = setUp(true),
        modes: EscapeMode[] = [];

      withTargets(set);
      set.ruleRegistry.register(
        new AgentSurvives(
          new Effect((unit: Unit, mission: UnitAction, mode: EscapeMode) => {
            modes.push(mode);

            return mode === -1;
          })
        )
      );
      set.action.perform('production');

      expect(set.action.targets()).to.deep.equal([Temple, 'production']);
      expect(set.chosen).to.deep.equal(['production']);
      expect(modes).to.deep.equal([-1, 1]);
      expect(set.log).to.deep.equal([
        'sabotaged true true',
        'moved true true',
        'destroyed true null',
      ]);
    });
  });
});
