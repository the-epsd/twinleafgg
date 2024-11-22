"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Delcatty = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Delcatty extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Skitty';
        this.cardType = game_1.CardType.COLORLESS;
        this.hp = 90;
        this.weakness = [{ type: game_1.CardType.FIGHTING }];
        this.resistance = [];
        this.retreat = [game_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Search for Friends',
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may put 2 Supporter cards from your discard pile into your hand.'
            }];
        this.attacks = [
            {
                name: 'Cat Kick',
                cost: [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 40,
                text: ''
            }
        ];
        this.set = 'CES';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '121';
        this.name = 'Delcatty';
        this.fullName = 'Delcatty CES';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const supportersInDiscard = player.discard.cards.filter(c => c instanceof game_1.TrainerCard && c.trainerType === game_1.TrainerType.SUPPORTER).length;
            if (supportersInDiscard === 0) {
                return state;
            }
            // Check if DiscardToHandEffect is prevented
            const discardEffect = new play_card_effects_1.DiscardToHandEffect(player, this);
            store.reduceEffect(state, discardEffect);
            if (discardEffect.preventDefault) {
                return state;
            }
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: game_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    const max = Math.min(supportersInDiscard, 2);
                    state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: game_1.SuperType.TRAINER, trainerType: game_1.TrainerType.SUPPORTER }, { min: max, max: max, allowCancel: false }), selected => {
                        const cards = selected || [];
                        store.prompt(state, [new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards)], () => {
                            player.discard.moveCardsTo(cards, player.hand);
                        });
                        cards.forEach(card => {
                            store.log(state, game_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
                        });
                        return state;
                    });
                }
            });
        }
        return state;
    }
}
exports.Delcatty = Delcatty;
