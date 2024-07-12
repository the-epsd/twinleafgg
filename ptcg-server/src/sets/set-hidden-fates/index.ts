import { Card } from '../../game/store/card/card';
import { CharmanderArt, ErikasHospitalityArt, PsyduckArt } from './card-images';
import { AlolanVulpixArt } from './full-art';

export const setHiddenFates: Card[] = [

  new CharmanderArt(),
  new ErikasHospitalityArt(),
  new PsyduckArt(),

  // Full Arts/Shiny Vault
  new AlolanVulpixArt(),
];
