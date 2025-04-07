import { Card } from '../../game/store/card/card';
import { AlolanVulpix } from './alolan-vulpix';
import { Charmander } from './charmander';
import { ErikasHospitality } from './erikas-hospitality';
import { MoltresZapdosArticunoGX } from './moltres-zapdos-articuno-gx';
import { Psyduck } from './psyduck';
import { QuagsireSV, WooperSV } from './shiny-vault';

export const setHiddenFates: Card[] = [

  new Charmander(),
  new ErikasHospitality(),
  new MoltresZapdosArticunoGX(),
  new Psyduck(),

  // FA/Shiny Vault
  new AlolanVulpix(),
  new WooperSV(),
  new QuagsireSV()
];
