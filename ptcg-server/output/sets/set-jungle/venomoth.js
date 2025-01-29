"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Venomoth = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Venomoth extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Venonat';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.powers = [{
                name: 'Shift',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEMON_POWER,
                text: 'Once during your turn (before your attack), you may change the type of Venomoth to the type of any other Pokémon in play other than Colorless. This power can\'t be used if Venomoth is Asleep, Confused, or Paralyzed.'
            }];
        this.attacks = [{
                name: 'Venom Powder',
                cost: [G, G],
                damage: 10,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Confused and Poisoned.'
            }];
        this.set = 'JU';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '13';
        this.name = 'Venomoth';
        this.fullName = 'Venomoth JU';
        this.SHIFT_MARKER = 'SHIFT_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const cardList = game_1.StateUtils.findCardList(state, this);
            if (cardList.specialConditions.includes(card_types_1.SpecialCondition.ASLEEP) ||
                cardList.specialConditions.includes(card_types_1.SpecialCondition.CONFUSED) ||
                cardList.specialConditions.includes(card_types_1.SpecialCondition.PARALYZED)) {
                return state;
            }
            const blocked = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, index) => {
                if (card.cardType === card_types_1.CardType.COLORLESS) {
                    blocked.push(index);
                }
            });
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, index) => {
                if (card.cardType === card_types_1.CardType.COLORLESS) {
                    blocked.push(index);
                }
            });
            if (player.marker.hasMarker(this.SHIFT_MARKER)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false, blocked: blocked }), result => {
                const cardList = result[0];
                const cardListPokemon = cardList.getPokemonCard();
                this.cardType = cardListPokemon.cardType;
                player.marker.addMarker(this.SHIFT_MARKER, this);
            });
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.SHIFT_MARKER, this)) {
            effect.player.marker.removeMarker(this.SHIFT_MARKER, this);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            state = store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], results => {
                if (results) {
                    opponent.active.addSpecialCondition(card_types_1.SpecialCondition.CONFUSED);
                    opponent.active.addSpecialCondition(card_types_1.SpecialCondition.POISONED);
                }
            });
            return state;
        }
        return state;
    }
}
exports.Venomoth = Venomoth;
