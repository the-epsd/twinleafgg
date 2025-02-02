"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Skiploom = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_2 = require("../../game");
class Skiploom extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Hoppip';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -20 }];
        this.retreat = [];
        this.powers = [{
                name: 'Floral Path to the Sky',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), you may search your deck for Jumpluff, put this Pokémon and all cards attached to it in the Lost Zone, and put that Jumpluff in its place. Then, shuffle your deck.'
            }];
        this.attacks = [
            {
                name: 'Tackle',
                cost: [card_types_1.CardType.GRASS],
                damage: 30,
                text: ''
            }
        ];
        this.set = 'LOT';
        this.setNumber = '13';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Skiploom';
        this.fullName = 'Skiploom LOT';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            // checking if this pokemon is in play
            let isThisInPlay = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isThisInPlay = true;
                }
            });
            if (!isThisInPlay) {
                return state;
            }
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (cardList.getPokemonCard() === this) {
                    // putting this card into the lost zone
                    cardList.moveTo(player.lostzone);
                    cardList.clearEffects();
                    // replacing the card with a jumpluff from the deck
                    return store.prompt(state, new game_2.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.deck, { superType: game_1.SuperType.POKEMON, name: 'Jumpluff' }, { min: 0, max: 1, allowCancel: false }), selected => {
                        const cards = selected || [];
                        player.deck.moveCardsTo(cards, cardList);
                    });
                }
            });
        }
        return state;
    }
}
exports.Skiploom = Skiploom;
