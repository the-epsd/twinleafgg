import { Card } from '../../game';
import { Bulbasaur } from './bulbasaur';
import { GarchompC } from './garchomp-c';
import { GarchompCLVX } from './garchomp-c-lv-x';
import { Ivysaur } from './ivysaur';
import { MrMime } from './mr-mime';
import { PalmersContribution } from './palmers-contribution';
import { StaraptorFB } from './staraptor-fb';
import { StaraptorFBLVX } from './staraptor-fb-lv-x';

// Other prints
import { VsSeekerSV } from './other-prints';

export const setSupremeVictors: Card[] = [
  new Bulbasaur(),
  new GarchompC(),
  new GarchompCLVX(),
  new Ivysaur(),
  new MrMime(),
  new PalmersContribution(),
  new StaraptorFB(),
  new StaraptorFBLVX(),

  // Other prints
  new VsSeekerSV(),
];