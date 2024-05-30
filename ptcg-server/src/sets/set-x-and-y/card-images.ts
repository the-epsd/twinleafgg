import { DoubleColorlessEnergy } from './double-colorless-energy';
import { Evosoda } from './evosoda';
import { FairyEnergy } from './fairy-energy';
import { MuscleBand } from './muscle-band';
import { Pikachu } from './pikachu';
import { ProfessorsLetter } from './professors-letter';
import { Raichu } from './raichu';
import { ShadowCircle } from './shadow-circle';
import { Shauna } from './shauna';
import { SuperPotion } from './super-potion';
import { YveltalEx } from './yveltal-ex';

export class FairyEnergyArt extends FairyEnergy {
  public set: string = '';
  public setNumber = '9';
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/XY/XY_140_R_EN_LG.png';
  public fullName: string = 'Fairy Energy';
}

export class DoubleColorlessEnergyArt extends DoubleColorlessEnergy {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/XY/XY_130_R_EN.png';
}
  
export class EvosodaArt extends Evosoda {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/XY/XY_116_R_EN.png'; 
}
  
export class MuscleBandArt extends MuscleBand {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/XY/XY_121_R_EN.png';
}
  
export class PikachuArt extends Pikachu {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/XY/XY_042_R_EN.png';
}
  
export class ProfessorsLetterArt extends ProfessorsLetter {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/XY/XY_123_R_EN.png';
}
  
export class RaichuArt extends Raichu {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/XY/XY_043_R_EN.png';  
}
  
export class ShadowCircleArt extends ShadowCircle {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/XY/XY_126_R_EN.png';
}
  
export class ShaunaArt extends Shauna {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/XY/XY_127_R_EN.png';
}
  
export class SuperPotionArt extends SuperPotion {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/XY/XY_128_R_EN.png';
}
  
export class YveltalExArt extends YveltalEx {
  public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/XY/XY_079_R_EN.png';
}
  