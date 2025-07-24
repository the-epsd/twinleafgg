import { Card } from '../../game/store/card/card';
import { FirefighterPikachu } from './firefighter-pikachu';
import { GreninjaGX } from './greninja-gx';
import { JolteonGX } from './jolteon-gx';
import { LucarioGX } from './lucario-gx';
import { Lurantis } from './lurantis';
import { CelebiVenusaurGXSMP, DhelmiseSMP, EeveeSnorlaxGXSMP, EspeonDeoxysGXSMP, LucarioMelmetalGXSMP, LycanrocSMP, MagikarpWailordGXSMP, MewSMP, ReshiramCharizardGXSMP, UmbreonDarkraiGXSMP, VenusaurSnivyGXSMP } from './other-prints';
import { PalaceBook } from './palace-book';
import { PikachuZekromGX } from './pikachu-and-zekrom-gx';
import { ShiningCelebi } from './shining-celebi';
import { ShiningLugia } from './shining-lugia';
import { TapuKoko } from './tapu-koko';
import { TapuLele } from './tapu-lele';
import { TrevenantDusknoirGX } from './trevenant-dusknoir-gx';

export const setSunAndMoonPromos: Card[] = [
  new FirefighterPikachu(),
  new GreninjaGX(),
  new JolteonGX(),
  new LucarioGX(),
  new Lurantis(),
  new PalaceBook(),
  new PikachuZekromGX(),
  new ShiningCelebi(),
  new ShiningLugia(),
  new TapuKoko(),
  new TapuLele(),
  new TrevenantDusknoirGX(),

  // Other prints
  new UmbreonDarkraiGXSMP(),
  new LucarioMelmetalGXSMP(),
  new LycanrocSMP(),
  new EeveeSnorlaxGXSMP(),
  new MagikarpWailordGXSMP(),
  new MewSMP(),
  new CelebiVenusaurGXSMP(),
  new DhelmiseSMP(),
  new EspeonDeoxysGXSMP(),
  new ReshiramCharizardGXSMP(),
  new VenusaurSnivyGXSMP(),
];
