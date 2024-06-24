export class Rules {

  public firstTurnDrawCard = true;

  public firstTurnUseSupporter = true;

  public unlimitedEnergyAttachments = false;

  constructor(init: Partial<Rules> = {}) {
    Object.assign(this, init);
  }

}
