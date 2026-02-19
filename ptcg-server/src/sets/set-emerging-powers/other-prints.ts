import { Gothorita } from '../set-legendary-treasures/gothorita';
import { Gothitelle } from '../set-legendary-treasures/gothitelle';
import { GreatBall } from '../set-ex-firered-leafgreen/great-ball';
import { Tornadus as TornadusEPO89 } from '../set-emerging-powers/tornadus';
import { Recycle } from '../set-fossil/recycle';
import { CrushingHammer } from '../set-scarlet-and-violet/crushing-hammer';

export class CrushingHammerEPO extends CrushingHammer {
  public set = 'EPO';
  public setNumber = '92';
  public fullName: string = 'Crushing Hammer (EPO 92)';
  public legacyFullName = 'Crushing Hammer EPO';
}

export class RecycleEPO extends Recycle {
  public set = 'EPO';
  public setNumber = '96';
  public fullName: string = 'Recycle (EPO 96)';
  public legacyFullName = 'Recycle EPO';
  public text: string = 'Flip a coin. If heads, put a card from your discard pile on top of your deck.';
}
export class GothoritaEPO extends Gothorita {
  public setNumber = '45';
  public fullName: string = 'Gothorita (EPO 45)';
  public legacyFullName = 'Gothorita EPO';
  public set = 'EPO';
}

export class GothitelleEPO extends Gothitelle {
  public setNumber = '47';
  public fullName: string = 'Gothitelle (EPO 47)';
  public legacyFullName = 'Gothitelle EPO';
  public set = 'EPO';
}

export class GreatBallEPO extends GreatBall {
  public setNumber = '93';
  public fullName: string = 'Great Ball (EPO 93)';
  public legacyFullName = 'Great Ball EPO';
  public set = 'EPO';
}

export class Tornadus2EPO extends TornadusEPO89 {
  public setNumber = '98';
  public fullName: string = 'Tornadus (EPO 98)';
  public legacyFullName = 'Tornadus2 EPO';
  public set = 'EPO';
}
