import {
  addScriptHook,
  degrees,
  doAfter,
  doPeriodically,
  randomAngle,
  Unit,
  vec2,
  W3TS_HOOK,
  unitId,
  onAnyUnitSpellEffect,
  abilId,
} from 'w3lib';
import {Players} from 'w3lib/src/globals/index';

const BUILD_DATE = compiletime(() => new Date().toUTCString());

function tsMain() {
  print(`Build: ${BUILD_DATE}`);
  print(' ');
  print('Welcome to TypeScript!');

  const pos = vec2(0, 0);
  const unit = new Unit(Players[0], unitId('hfoo'), pos, degrees(270));
  unit.name = 'TypeScript';

  const archer = new Unit(
    Players[0],
    unitId('earc'),
    vec2(0, 0),
    randomAngle()
  );

  const colorChange = doPeriodically(1, () => {
    unit.color = Players[math.random(0, bj_MAX_PLAYERS)].color;
  });
  let angle = degrees(0);
  const animation = doPeriodically(0.02, () => {
    angle = angle.add(degrees(360 / 100));
    const nextPos = unit.pos.polarOffset(angle, 300);
    archer.pos = nextPos;
    archer.facing = nextPos.angleTo(unit.pos);
  });

  doAfter(30, () => {
    print('That was my set! Thanks for coming!');
    colorChange.cancel();
    animation.cancel();
  });

  const banishId = abilId('AHbn');
  onAnyUnitSpellEffect((caster, abilityId, target) => {
    if (abilityId.equals(banishId) && target instanceof Unit) {
      print(caster.name + ' banished ' + target.name + '!');
    }
  });
}

addScriptHook(W3TS_HOOK.MAIN_AFTER, tsMain);
