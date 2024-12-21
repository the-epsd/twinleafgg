import { Card } from '../../game/store/card/card';
import { Quagsire } from '../set-dragons-majesty/quagsire';
import { Wooper } from '../set-dragons-majesty/wooper';
import { AlolanVulpix } from './alolan-vulpix';
import { Charmander } from './charmander';
import { ErikasHospitality } from './erikas-hospitality';
import { Psyduck } from './psyduck';

export const setHiddenFates: Card[] = [

  new Charmander(),
  new ErikasHospitality(),
  new Psyduck(),

  // Full s/Shiny Vault
  new AlolanVulpix(),
  new Wooper(),
  new Quagsire()
];
