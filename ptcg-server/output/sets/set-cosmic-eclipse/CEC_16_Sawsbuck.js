"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sawsbuck = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Sawsbuck extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 100;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.evolvesFrom = 'Deerling';
        this.powers = [{
                name: 'Seasonal Blessings',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), you may draw a card. '
            }];
        this.attacks = [{
                name: 'Bounce',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS],
                damage: 60,
                text: 'You may switch this Pokémon with 1 of your Benched Pokémon. '
            }];
        this.set = 'CEC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '16';
        this.name = 'Sawsbuck';
        this.fullName = 'Sawsbuck CEC';
        this.bounceMarker = false;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            player.deck.moveTo(player.hand, 1);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            this.bounceMarker = true;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && this.bounceMarker == true) {
            const player = effect.player;
            const hasBenched = player.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                return state;
            }
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_SWITCH_POKEMON), wantToUse => {
                if (wantToUse) {
                    return state = store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_NEW_ACTIVE_POKEMON, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), selected => {
                        if (!selected || selected.length === 0) {
                            return state;
                        }
                        const target = selected[0];
                        player.switchPokemon(target);
                        this.bounceMarker = false;
                    });
                }
            });
        }
        return state;
    }
}
exports.Sawsbuck = Sawsbuck;
