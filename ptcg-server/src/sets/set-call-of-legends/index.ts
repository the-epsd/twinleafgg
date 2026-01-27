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
  ProfessorElmsTrainingMethodCL,
  SmeargleCL
} from './other-prints';

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
  new ProfessorElmsTrainingMethodCL(),
  new SmeargleCL(),
];