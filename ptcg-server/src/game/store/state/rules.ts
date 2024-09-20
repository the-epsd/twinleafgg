export class Rules {

  public firstTurnDrawCard = true;

  public firstTurnUseSupporter = true;

  public attackFirstTurn = false;

  public unlimitedEnergyAttachments = false;

  constructor(init: Partial<Rules> = {}) {
    Object.assign(this, init);
  }

}
