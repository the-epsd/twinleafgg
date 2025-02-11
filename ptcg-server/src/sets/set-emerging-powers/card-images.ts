import { Recycle } from '../set-fossil/recycle';
import { CrushingHammer } from '../set-scarlet-and-violet/crushing-hammer';

export class CrushingHammerEPO extends CrushingHammer {
  public set = 'EPO';
  public setNumber = '92';
  public fullName: string = 'Crushing Hammer EPO';
}

export class RecycleEPO extends Recycle {
  public set = 'EPO';
  public setNumber = '96';
  public fullName: string = 'Recycle EPO';
  public text: string = 'Flip a coin. If heads, put a card from your discard pile on top of your deck.';
}