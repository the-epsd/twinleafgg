"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mamoswineex = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Mamoswineex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.evolvesFrom = 'Piloswine';
        this.cardType = F;
        this.hp = 340;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C, C];
        this.powers = [{
                name: 'Mammoth Ride',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, you may search your deck for 1 Pokémon, reveal it, and put it into your hand. Then shuffle your deck.'
            }];
        this.attacks = [
            {
                name: 'Roaring March',
                cost: [F, F],
                damage: 180,
                damageCalculation: '+',
                text: 'This attack does 40 more damage for each of your Benched Stage 2 Pokémon.'
            }
        ];
        this.regulationMark = 'I';
        this.set = 'SV9';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '46';
        this.name = 'Mamoswine ex';
        this.fullName = 'Mamoswine ex SV9';
        this.MAMMOTH_RIDE_MARKER = 'MAMMOTH_RIDE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.MAMMOTH_RIDE_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.marker.removeMarker(this.MAMMOTH_RIDE_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.marker.hasMarker(this.MAMMOTH_RIDE_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.POKEMON }, { min: 0, max: 1, allowCancel: false }), cards => {
                player.deck.moveCardsTo(cards, player.hand);
                if (cards.length > 0) {
                    state = store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => { });
                }
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (cardList.getPokemonCard() === this) {
                        cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                    }
                });
                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                    player.marker.addMarker(this.MAMMOTH_RIDE_MARKER, this);
                });
            });
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, player => {
                if (player instanceof Mamoswineex) {
                    player.marker.removeMarker(this.MAMMOTH_RIDE_MARKER);
                }
            });
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            let stage2Count = 0;
            player.bench.forEach(bench => {
                const pokemon = bench.getPokemonCard();
                if (pokemon && pokemon.stage === card_types_1.Stage.STAGE_2) {
                    stage2Count++;
                }
            });
            effect.damage = 180 + (stage2Count * 40);
        }
        return state;
    }
}
exports.Mamoswineex = Mamoswineex;
