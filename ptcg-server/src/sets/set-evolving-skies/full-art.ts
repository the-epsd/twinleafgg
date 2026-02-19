import { RayquazaV } from './rayquaza-v';
import { RayquazaVMAX } from './rayquaza-vmax';
import { TurffieldStadium } from '../set-champions-path/turffield-stadium';

export class RayquazaVAA extends RayquazaV {
  public setNumber = '194';
  public fullName = 'Rayquaza V (EVS 194)';
  public legacyFullName = 'RayquazaVAA EVS';
}

export class RayquazaVMAXAA extends RayquazaVMAX {
  public setNumber = '218';
  public fullName = 'Rayquaza VMAX (EVS 218)';
  public legacyFullName = 'RayquazaVMAXAA EVS';
}

export class TurffieldStadiumEVSSR extends TurffieldStadium {
  public set = 'EVS';
  public setNumber = '234';
  public fullName = 'Turffield Stadium (EVS 234)';
  public legacyFullName = 'Turffield Stadium EVS SR';
}