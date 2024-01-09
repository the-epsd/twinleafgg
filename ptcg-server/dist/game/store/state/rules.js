export class Rules {
    constructor(init = {}) {
        this.firstTurnDrawCard = true;
        this.firstTurnUseSupporter = true;
        Object.assign(this, init);
    }
}
