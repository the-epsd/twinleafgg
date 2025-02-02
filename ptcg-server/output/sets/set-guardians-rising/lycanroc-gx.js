"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LycanrocGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
// GRI Lycanroc-GX 74 (https://limitlesstcg.com/cards/GRI/74)
class LycanrocGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_GX];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Rockruff';
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 200;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Bloodthirsty Eyes',
                useWhenInPlay: false,
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may switch 1 of your opponent\'s Benched Pokémon with their Active Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Claw Slash',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 110,
                text: ''
            },
            {
                name: 'Dangerous Rogue-GX',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS],
                damage: 50,
                gxAttack: true,
                text: 'This attack does 50 damage for each of your opponent\'s Benched Pokémon. (You can\'t use more than 1 GX attack in a game.)'
            }
        ];
        this.set = 'GRI';
        this.name = 'Lycanroc-GX';
        this.fullName = 'Lycanroc-GX GRI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '74';
    }
    reduceEffect(store, state, effect) {
        // Bloodthirsty Eyes
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasBench = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBench) {
                return state;
            }
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), result => {
                        const cardList = result[0];
                        player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                            if (cardList.getPokemonCard() === this) {
                                cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                            }
                        });
                        opponent.switchPokemon(cardList);
                    });
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Check if player has used GX attack
            if (player.usedGX == true) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_GX_USED);
            }
            // set GX attack as used for game
            player.usedGX = true;
            const benched = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
            effect.damage = 50 * benched;
        }
        return state;
    }
}
exports.LycanrocGX = LycanrocGX;
