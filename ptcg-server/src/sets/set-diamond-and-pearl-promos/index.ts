import { ChimcharDPP, PiplupDPP, GiratinaLVXDPP, GarchompCLVXDPP, ArceusLvX22DPP } from './other-prints';
import { Card } from '../../game/store/card/card';
import { ToxicroakG } from './toxicroak-g';

// Other Prints
import { DialgaLVXDPP } from './other-prints';
import { DialgaLVXDPP2 } from './other-prints';
import { MewtwoLVXDPP } from './other-prints';

export const setDiamondAndPearlPromos: Card[] = [
  new ToxicroakG(),

  // Other Prints
  new DialgaLVXDPP(),
  new DialgaLVXDPP2(),
  new MewtwoLVXDPP(),
  new ChimcharDPP(),
  new PiplupDPP(),
  new GiratinaLVXDPP(),
  new GarchompCLVXDPP(),
  new ArceusLvX22DPP(),
];