import { AttachEnergyEffect } from '../effects/play-card-effects';
import { GameError } from '../../game-error';
import { GameMessage, GameLog } from '../../game-message';
export function playEnergyReducer(store, state, effect) {
    /* Play energy card */
    if (effect instanceof AttachEnergyEffect) {
        const pokemonCard = effect.target.getPokemonCard();
        if (pokemonCard === undefined) {
            throw new GameError(GameMessage.INVALID_TARGET);
        }
        store.log(state, GameLog.LOG_PLAYER_ATTACHES_CARD, {
            name: effect.player.name,
            card: effect.energyCard.name,
            pokemon: pokemonCard.name
        });
        effect.player.hand.moveCardTo(effect.energyCard, effect.target);
        return state;
    }
    return state;
}
