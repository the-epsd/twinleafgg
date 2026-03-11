import { Card } from '../../game/store/card/card';
import { CheerleadersCheer } from './cheerleaders-cheer';
import { Jirachi } from './jirachi';
import { LostRemover } from './lost-remover';
import { LostWorld } from './lost-world';
import { Lucario } from './lucario';
import { MimeJr } from './mime-jr';
import { MrMime } from './mr-mime';
import { Pachirisu } from './pachirisu';
import { Relicanth } from './relicanth';
import { SagesTraining } from './sages-training';
import { Tyrogue } from './tyrogue';
import { Umbreon } from './umbreon';

// Other prints
import {
  CleffaCL,
  CopycatCL,
  DualBallCL,
  NinetalesCL,
  ProfessorElmsTrainingMethodCL,
  QuilavaCL,
  SmeargleCL,
  VulpixCL
} from './other-prints';

// Basic energies
import {
  GrassEnergy,
  FireEnergy,
  WaterEnergy,
  LightningEnergy,
  PsychicEnergy,
  FightingEnergy,
  DarknessEnergy,
  MetalEnergy,
} from './basic-energies';

export const setCallOfLegends: Card[] = [
  new CheerleadersCheer(),
  new Jirachi(),
  new LostRemover(),
  new LostWorld(),
  new Lucario(),
  new MimeJr(),
  new MrMime(),
  new Pachirisu(),
  new Relicanth(),
  new SagesTraining(),
  new Tyrogue(),
  new Umbreon(),

  // Other prints
  new CleffaCL(),
  new CopycatCL(),
  new DualBallCL(),
  new NinetalesCL(),
  new ProfessorElmsTrainingMethodCL(),
  new QuilavaCL(),
  new SmeargleCL(),
  new VulpixCL(),

  // Basic energies
  new GrassEnergy(),
  new FireEnergy(),
  new WaterEnergy(),
  new LightningEnergy(),
  new PsychicEnergy(),
  new FightingEnergy(),
  new DarknessEnergy(),
  new MetalEnergy(),
];