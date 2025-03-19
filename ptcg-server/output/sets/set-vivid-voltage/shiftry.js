"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shiftry = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Shiftry extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'D';
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Nuzleaf';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 150;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Fan Tornado',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS],
                damage: 110,
                damageCalculation: 'x',
                text: 'You may have your opponent switch their Active Pokémon with 1 of their Benched Pokémon.'
            }];
        this.powers = [{
                name: 'Shiftry Substitution',
                text: 'As long as this Pokémon is in the Active Spot, each Supporter card in your opponent\'s hand has the effect “Draw 3 cards.” (This happens instead of the card\'s usual effect.)',
                useWhenInPlay: false,
                powerType: game_1.PowerType.ABILITY
            }];
        this.set = 'VIV';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '12';
        this.name = 'Shiftry';
        this.fullName = 'Shiftry VIV';
        this.usedFanTornado = false;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard.trainerType === card_types_1.TrainerType.SUPPORTER) {
            const cardList = game_1.StateUtils.findCardList(state, this);
            // owner of shiftry
            const player = game_1.StateUtils.findOwner(state, cardList);
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // if shiftry's player played card, don't block it
            if (player === effect.player) {
                return state;
            }
            if (prefabs_1.IS_ABILITY_BLOCKED(store, state, player, this)) {
                return state;
            }
            if (player.active === cardList) {
                effect.preventDefault = true;
                opponent.deck.moveTo(opponent.hand, 3);
            }
            return state;
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            this.usedFanTornado = true;
        }
        if (prefabs_1.AFTER_ATTACK(effect) && this.usedFanTornado) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            this.usedFanTornado = false;
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_SWITCH_POKEMON), wantToUse => {
                if (wantToUse) {
                    return store.prompt(state, new game_1.ChoosePokemonPrompt(opponent.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                        if (targets && targets.length > 0) {
                            opponent.active.clearEffects();
                            opponent.switchPokemon(targets[0]);
                            return state;
                        }
                    });
                }
            });
        }
        return state;
    }
}
exports.Shiftry = Shiftry;
