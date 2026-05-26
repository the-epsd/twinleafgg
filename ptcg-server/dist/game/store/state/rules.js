export class Rules {
    constructor(init = {}) {
        this.firstTurnDrawCard = true;
        this.firstTurnUseSupporter = true;
        this.attackFirstTurn = false;
        // If true, supporters remain in the play zone until end-turn cleanup.
        this.supporterCleanupAtEndTurn = false;
        this.unlimitedEnergyAttachments = false;
        this.alternativeSetup = false;
        Object.assign(this, init);
    }
}
