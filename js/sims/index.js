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

export const SIMS = { pendulum: Pendulum, scale: Scale, race: Race, fall: Fall, cannon: Cannon, lab: Lab, river: River, circle: Circle, cart: Cart, ramp: Ramp, coaster: Coaster };

// in inglese: etichette dei controlli e nomi degli oggetti disegnati
for (const S of Object.values(SIMS)) translateTree(S.controls);
translateTree({ OBJECTS, OBJ });
