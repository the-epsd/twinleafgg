import { GameError, GameMessage } from '../../game';
export class SimpleScore {
    constructor(options) {
        this.options = options;
    }
    getPlayer(state, playerId) {
        const player = state.players.find(p => p.id === playerId);
        if (player === undefined) {
            throw new GameError(GameMessage.INVALID_GAME_STATE);
        }
        return player;
    }
    getPokemonScoreBy(scores, cardList) {
        const card = cardList.getPokemonCard();
        if (card === undefined) {
            return 0;
        }
        let damage = 0;
        card.attacks.forEach(a => damage += a.damage);
        let score = 0;
        score += scores.hp * card.hp;
        score += scores.damage * damage;
        score += scores.ability * card.powers.length;
        score += scores.retreat * card.retreat.length;
        return score;
    }
}
