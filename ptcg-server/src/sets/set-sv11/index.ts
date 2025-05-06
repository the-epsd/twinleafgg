import { Card } from '../../game/store/card/card';

import { Dewott } from './dewott';
import { Emboar } from './emboar';
import { Hilda } from './hilda';
import { IgnitionEnergy } from './ignition-energy';
import { Kyuremex } from './kyurem-ex';
import { Oshawott } from './oshawott';
import { AirBalloonSV11, CherenSV11, EnergyRetrievalSV11, PrismEnergySV11, ProfessorsResearchSV11 } from './other-prints';
import { Pignite } from './pignite';
import { Reshiramex } from './reshiram-ex';
import { Samurott } from './samurott';
import { Serperiorex } from './serperior-ex';
import { Servine } from './servine';
import { Snivy } from './snivy';
import { Tepig } from './tepig';
import { Victini } from './victini';
import { Zekromex } from './zekrom-ex';

export const setSV11: Card[] = [
  new Victini(),

  new Snivy(),
  new Servine(),
  new Serperiorex(),

  new Tepig(),
  new Pignite(),
  new Emboar(),

  new Oshawott(),
  new Dewott(),
  new Samurott(),

  new Kyuremex(),
  new Zekromex(),
  new Reshiramex(),

  new Hilda(),

  new CherenSV11(),
  new ProfessorsResearchSV11(),

  new EnergyRetrievalSV11(),

  new AirBalloonSV11(),

  new IgnitionEnergy(),
  new PrismEnergySV11(),

];
