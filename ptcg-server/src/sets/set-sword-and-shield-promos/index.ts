import { Card } from '../../game/store/card/card';
import { ChampionsFestival } from './champions-festival';
import { Charmander } from './charmander';
import { DeoxysV } from './deoxys-v';
import { DeoxysVSTAR } from './deoxys-vstar';
import { HisuianElectrodeV } from './hisuian-electrode-v';
import { LeafeonVSTAR } from './leafeon-vstar';
import { LucarioVSTAR } from './lucario-vstar';
import { Manaphy } from './manaphy';
import { Oricorio } from './oricorio';
import { ProfessorBurnet } from './professor-burnett';
import { Scorbunny } from './scorbunny';
import { Tepig } from './tepig';
import { VenusaurV } from './venusaur-v';
import { VenusaurVMAX } from './venusaur-vmax';

export const setSwordAndShieldPromos: Card[] = [

  new ChampionsFestival(),
  new Charmander(),
  new DeoxysV(),
  new DeoxysVSTAR(),
  new HisuianElectrodeV(),
  new LeafeonVSTAR(),
  new LucarioVSTAR(),
  // new LucarioVSTAR2(),
  new Oricorio(),
  new ProfessorBurnet(),
  new Manaphy(),
  new Scorbunny(),
  new Tepig(),
  new VenusaurV(),
  new VenusaurVMAX(),
];
