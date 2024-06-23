export class Rules {
    constructor(init = {}) {
        this.firstTurnDrawCard = true;
        this.firstTurnUseSupporter = true;
        this.unlimitedEnergyAttachments = true;
        Object.assign(this, init);
    }
}
