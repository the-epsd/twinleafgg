import { Card } from '../../game/store/card/card';
import { CharmanderArt, ErikasHospitalityArt } from './card-images';
import { AlolanVulpixArt } from './full-art';

export const setHiddenFates: Card[] = [

  new CharmanderArt(),
  new ErikasHospitalityArt(),

  // Full Arts/Shiny Vault
  new AlolanVulpixArt(),
];
