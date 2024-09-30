import { Card } from '../../game/store/card/card';
import { CharmanderArt, ErikasHospitalityArt, PsyduckArt, QuagsireArt, WooperArt } from './card-images';
import { AlolanVulpixArt } from './full-art';

export const setHiddenFates: Card[] = [

  new CharmanderArt(),
  new ErikasHospitalityArt(),
  new PsyduckArt(),

  // Full Arts/Shiny Vault
  new AlolanVulpixArt(),
  new WooperArt(),
  new QuagsireArt()
];
