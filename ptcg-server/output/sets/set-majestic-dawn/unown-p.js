"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnownP = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const prefabs_2 = require("../../game/store/prefabs/prefabs");
class UnownP extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.evolvesFrom = 'Unown P';
        this.cardType = P;
        this.hp = 50;
        this.weakness = [{ type: P, value: +10 }];
        this.retreat = [C];
        this.powers = [{
                name: 'PUT',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), if Unown P is on your Bench, you may put 1 damage counter on 1 of your Pokémon (excluding any Unown).'
            }];
        this.attacks = [
            {
                name: 'Hidden Power',
                cost: [P],
                damage: 20,
                damageCalculation: '+',
                text: 'Each player discards the top card of his or her deck. This attack does 20 damage plus 20 more damage for each Unown discarded in this way.'
            },
        ];
        this.set = 'MD';
        this.name = 'Unown P';
        this.fullName = 'Unown P MD';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '33';
        this.PUT_MARKER = 'PUT_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            prefabs_2.REMOVE_MARKER(this.PUT_MARKER, effect.player, this);
        }
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            // Ensure the Pokémon is on the bench
            const isOnBench = player.bench.some(cardList => cardList.getPokemonCard() === this);
            if (!isOnBench) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            // Once per turn
            if (prefabs_2.HAS_MARKER(this.PUT_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            const blocked = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
                if (card.name.includes('Unown')) {
                    blocked.push(target);
                }
            });
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { allowCancel: false, blocked }), targets => {
                if (!targets || targets.length === 0) {
                    return;
                }
                prefabs_2.ADD_MARKER(this.PUT_MARKER, player, this);
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (cardList.getPokemonCard() === this) {
                        cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                    }
                });
                targets.forEach(target => {
                    target.damage += 10;
                });
            });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const playerTopDeck = new game_1.CardList();
            const opponentTopDeck = new game_1.CardList();
            let damageScaling = 0;
            player.deck.moveTo(playerTopDeck, 1);
            opponent.deck.moveTo(opponentTopDeck, 1);
            if (playerTopDeck.cards[0] instanceof pokemon_card_1.PokemonCard && playerTopDeck.cards[0].name.includes('Unown')) {
                damageScaling++;
            }
            if (opponentTopDeck.cards[0] instanceof pokemon_card_1.PokemonCard && opponentTopDeck.cards[0].name.includes('Unown')) {
                damageScaling++;
            }
            effect.damage += (20 * damageScaling);
            playerTopDeck.moveTo(player.discard);
            opponentTopDeck.moveTo(opponent.discard);
        }
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.PUT_MARKER, this);
        return state;
    }
}
exports.UnownP = UnownP;
