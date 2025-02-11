import { Card } from '../../game/store/card/card';
import { ChampionsFestival } from './champions-festival';
import { Charmander } from './charmander';
import { DeoxysV } from './deoxys-v';
import { DeoxysVSTAR } from './deoxys-vstar';
import { GreninjaVUNIONBottomLeft } from './greninja-v-union-bl';
import { GreninjaVUNIONBottomRight } from './greninja-v-union-br';
import { GreninjaVUNIONTopLeft } from './greninja-v-union-tl';
import { GreninjaVUNIONTopRight } from './greninja-v-union-tr';
import { HisuianElectrodeV } from './hisuian-electrode-v';
import { LeafeonVSTAR } from './leafeon-vstar';
import { LucarioVSTAR } from './lucario-vstar';
import { Manaphy } from './manaphy';
import { MewtwoVUNIONBottomLeft } from './mewtwo-v-union-bl';
import { MewtwoVUNIONBottomRight } from './mewtwo-v-union-br';
import { MewtwoVUNIONTopLeft } from './mewtwo-v-union-tl';
import { MewtwoVUNIONTopRight } from './mewtwo-v-union-tr';
import { MorpekoVUNIONBottomLeft } from './morpeko-v-union-bl';
import { MorpekoVUNIONBottomRight } from './morpeko-v-union-br';
import { MorpekoVUNIONTopLeft } from './morpeko-v-union-tl';
import { MorpekoVUNIONTopRight } from './morpeko-v-union-tr';
import { Oricorio } from './oricorio';
import { ZeraoraVMAXSWSH, ZeraoraVSTARSWSH, ZeraoraVSWSH } from './other-prints';
import { PikachuVUNIONBottomLeft } from './pikachu-v-union-bl';
import { PikachuVUNIONBottomRight } from './pikachu-v-union-br';
import { PikachuVUNIONTopLeft } from './pikachu-v-union-tl';
import { PikachuVUNIONTopRight } from './pikachu-v-union-tr';
import { ProfessorBurnet } from './professor-burnett';
import { Scorbunny } from './scorbunny';
import { Tepig } from './tepig';
import { VenusaurV } from './venusaur-v';
import { VenusaurVMAX } from './venusaur-vmax';
import { ZacianVUNIONBottomLeft } from './zacian-v-union-bl';
import { ZacianVUNIONBottomRight } from './zacian-v-union-br';
import { ZacianVUNIONTopLeft } from './zacian-v-union-tl';
import { ZacianVUNIONTopRight } from './zacian-v-union-tr';

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

  new MewtwoVUNIONTopLeft(),
  new MewtwoVUNIONTopRight(),
  new MewtwoVUNIONBottomLeft(),
  new MewtwoVUNIONBottomRight(),

  new PikachuVUNIONTopLeft(),
  new PikachuVUNIONTopRight(),
  new PikachuVUNIONBottomLeft(),
  new PikachuVUNIONBottomRight(),

  new ZacianVUNIONTopLeft(),
  new ZacianVUNIONTopRight(),
  new ZacianVUNIONBottomLeft(),
  new ZacianVUNIONBottomRight(),

  new GreninjaVUNIONTopLeft(),
  new GreninjaVUNIONTopRight(),
  new GreninjaVUNIONBottomLeft(),
  new GreninjaVUNIONBottomRight(),

  new MorpekoVUNIONTopLeft(),
  new MorpekoVUNIONTopRight(),
  new MorpekoVUNIONBottomLeft(),
  new MorpekoVUNIONBottomRight(),

  new ZeraoraVSWSH(),
  new ZeraoraVMAXSWSH(),
  new ZeraoraVSTARSWSH(),
];
