import { translateTree } from '../i18n.js';
import { Pendulum } from './pendulum.js';
import { Scale, OBJECTS } from './scale.js';
import { Race } from './race.js';
import { Fall, OBJ } from './fall.js';
import { Cannon } from './cannon.js';
import { Lab } from './lab.js';
import { River } from './river.js';
import { Circle } from './circle.js';
import { Cart } from './cart.js';
import { Ramp } from './ramp.js';
import { Coaster } from './coaster.js';
import { Collide } from './collide.js';
import { Lever } from './lever.js';
import { Tilt } from './tilt.js';
import { Orbit } from './orbit.js';
import { Weigh } from './weigh.js';

export const SIMS = { pendulum: Pendulum, scale: Scale, race: Race, fall: Fall, cannon: Cannon, lab: Lab, river: River, circle: Circle, cart: Cart, ramp: Ramp, coaster: Coaster, collide: Collide, lever: Lever, tilt: Tilt, orbit: Orbit, weigh: Weigh };

// in inglese: etichette dei controlli e nomi degli oggetti disegnati
// (controllo per controllo, così il nome di un controllo, per esempio k, non conta mai)
for (const S of Object.values(SIMS)) for (const c of Object.values(S.controls || {})) translateTree(c);
translateTree({ OBJECTS, OBJ });
