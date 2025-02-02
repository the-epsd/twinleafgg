"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DittoPrismStar = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class DittoPrismStar extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 40;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.tags = [card_types_1.CardTag.PRISM_STAR];
        this.powers = [{
                name: 'Almighty Evolution',
                powerType: pokemon_types_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), you may put any Stage 1 card from your hand onto this Pokémon to evolve it. You can\'t use this Ability during your first turn or the turn this Pokémon was put into play.'
            }];
        this.cardImage = 'assets/cardback.png';
        this.set = 'LOT';
        this.name = 'Ditto Prism Star';
        this.fullName = 'Ditto Prism Star LOT';
        this.setNumber = '154';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (state.turn === 1 || state.turn === 2) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const hasStage1InHand = player.hand.cards.some(c => {
                return c instanceof pokemon_card_1.PokemonCard && c.stage === card_types_1.Stage.STAGE_1;
            });
            if (!hasStage1InHand) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const dittoPrismStar = this;
            const dittoCardList = new game_1.PokemonCardList();
            dittoCardList.cards.push(dittoPrismStar);
            const dittoPlayedTurn = player.active.cards.includes(this)
                ? player.active
                : player.bench.find(b => b.cards.includes(this));
            if (!dittoPlayedTurn) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const playedTurnEffect = new check_effects_1.CheckPokemonPlayedTurnEffect(player, dittoPlayedTurn);
            store.reduceEffect(state, playedTurnEffect);
            if (playedTurnEffect.pokemonPlayedTurn === state.turn) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            let cards = [];
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_EVOLVE, player.hand, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.STAGE_1 }, { min: 1, max: 1, allowCancel: false }), selected => {
                cards = selected || [];
                if (cards.length > 0) {
                    const pokemonCard = cards[0];
                    const dittoCardList = player.active.cards.includes(this)
                        ? player.active
                        : player.bench.find(b => b.cards.includes(this));
                    if (dittoCardList) {
                        // Remove the Stage 1 card from the player's hand
                        selected[0].cards.moveTo(pokemonCard.cards);
                        const evolveEffect = new game_effects_1.EvolveEffect(player, dittoCardList, pokemonCard);
                        state = store.reduceEffect(state, evolveEffect);
                    }
                }
                return state;
            });
        }
        return state;
    }
}
exports.DittoPrismStar = DittoPrismStar;
