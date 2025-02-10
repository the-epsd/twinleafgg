"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crobat = void 0;
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Crobat extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Golbat';
        this.cardType = D;
        this.hp = 130;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [];
        this.powers = [
            {
                name: 'Shadowy Envoy',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your turn, if you played Janine\'s Secret Art from your hand this turn, you may draw cards until you have 8 cards in your hand.'
            }
        ];
        this.attacks = [
            {
                name: 'Poison Fang',
                cost: [D, C],
                damage: 120,
                text: 'Your opponent\'s Active Pokémon is now Poisoned. During Pokémon Checkup, put 2 damage counters on that Pokémon instead of 1.'
            }
        ];
        this.regulationMark = 'H';
        this.set = 'SFA';
        this.setNumber = '29';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Crobat';
        this.fullName = 'Crobat SFA';
        this.SHADOWY_ENVOY_MARKER = 'SHADOWY_ENVOY_MARKER';
        this.PLAY_JANINES_SECRET_ART_MARKER = 'PLAY_JANINES_SECRET_ART_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard.name == 'Janine\'s Secret Art') {
            prefabs_1.ADD_MARKER(this.PLAY_JANINES_SECRET_ART_MARKER, effect.player, this);
        }
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            prefabs_1.REMOVE_MARKER(this.SHADOWY_ENVOY_MARKER, effect.player, this);
        }
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            //Check if the player's hand has fewer than 8 cards, and if they have not already used the ability.
            if (player.hand.cards.length >= 8) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (prefabs_1.HAS_MARKER(this.SHADOWY_ENVOY_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            //If Janine's card was played, draw cards until you have 8 in hand.
            if (prefabs_1.HAS_MARKER(this.PLAY_JANINES_SECRET_ART_MARKER, player, this)) {
                /*When I tried to use the prefab to draw cards, I received this error:
                Argument of type 'PowerEffect' is not assignable to parameter of type 'AttackEffect'.
                  Type 'PowerEffect' is missing the following properties from type 'AttackEffect': opponent, attack, damage, ignoreWeakness, and 3 more.ts(2345)*/
                //DRAW_CARDS_UNTIL_YOU_HAVE_X_CARDS_IN_HAND(8, effect, state);
                while (player.hand.cards.length < 8) {
                    if (player.deck.cards.length === 0) {
                        break;
                    }
                    player.deck.moveTo(player.hand, 1);
                }
                //Mark the Pokémon to indicate that the ability has already been used.
                prefabs_1.ADD_MARKER(this.SHADOWY_ENVOY_MARKER, player, this);
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (cardList.getPokemonCard() === this) {
                        cardList.addBoardEffect(game_1.BoardEffect.ABILITY_USED);
                    }
                });
            }
            else {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            return state;
        }
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.PLAY_JANINES_SECRET_ART_MARKER, this);
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.PLAY_JANINES_SECRET_ART_MARKER, this);
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE(store, state, opponent, this, 20);
        }
        return state;
    }
}
exports.Crobat = Crobat;
