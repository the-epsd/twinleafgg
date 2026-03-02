export class Rules {

  public firstTurnDrawCard = true;

  public firstTurnUseSupporter = true;

  public attackFirstTurn = false;

  // If true, supporters remain in the play zone until end-turn cleanup.
  public supporterCleanupAtEndTurn = false;

  public unlimitedEnergyAttachments = false;

  public alternativeSetup = false;

  constructor(init: Partial<Rules> = {}) {
    Object.assign(this, init);
  }

}
