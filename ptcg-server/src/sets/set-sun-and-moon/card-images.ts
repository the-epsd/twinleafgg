import { EnergyRetrieval } from '../set-scarlet-and-violet/energy-retrieval';
import { ExpShare } from '../set-scarlet-and-violet/exp-share';
import { NestBall } from '../set-scarlet-and-violet/nest-ball';
import { RareCandy } from '../set-scarlet-and-violet/rare-candy';

export class EnergyRetrievalSUM extends EnergyRetrieval {
  public setNumber = '116';
  public fullName: string = 'Energy Retrieval SUM';
  public set = 'SUM';
}

export class ExpShareSUM extends ExpShare {
  public setNumber = '118';
  public fullName: string = 'Exp. Share SUM';
  public set = 'SUM';
}

export class NestBallSUM extends NestBall {
  public setNumber = '123';
  public fullName: string = 'Nest Ball SUM';
  public set = 'SUM';
}

export class RareCandySUM extends RareCandy {
  public setNumber = '129';
  public fullName: string = 'Rare Candy SUM';
  public set = 'SUM';
}