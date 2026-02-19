import { Applin } from '../set-rebel-clash/applin';
import { Snom } from './snom';

export class ApplinSV extends Applin {
  public set = 'SHF';
  public setNumber = 'SV12';
  public fullName = 'Applin (SHF SV12)';
  public legacyFullName = 'Applin SHF';
}

export class SnomSV extends Snom {
  public set = 'SHF';
  public setNumber = 'SV33';
  public fullName = 'Snom (SHF SV33)';
  public legacyFullName = 'Snom SHFSV';
}