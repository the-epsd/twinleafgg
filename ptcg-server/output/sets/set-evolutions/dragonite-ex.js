"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DragoniteEX = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class DragoniteEX extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.COLORLESS;
        this.hp = 180;
        this.weakness = [{ type: game_1.CardType.LIGHTNING }];
        this.resistance = [{ type: game_1.CardType.FIGHTING, value: -20 }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.tags = [game_1.CardTag.POKEMON_EX];
        this.powers = [{
                name: 'Pull Up',
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokémon from your hand onto your Bench, you may put 2 Basic Pokémon (except for Dragonite-EX) from your discard pile into your hand.'
            }];
        this.attacks = [{
                name: 'Hyper Beam',
                cost: [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 130,
                text: 'Discard an Energy attached to your opponent\'s Active Pokémon.'
            }];
        this.set = 'EVO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '72';
        this.name = 'Dragonite EX';
        this.fullName = 'Dragonite EX EVO';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            const hasBasicPokemonInDiscard = player.discard.cards.some(c => {
                return c instanceof game_1.PokemonCard
                    && c.stage === game_1.Stage.BASIC;
            });
            if (!hasBasicPokemonInDiscard) {
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
            return store.prompt(state, new game_1.ConfirmPrompt(player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), confirmed => {
                if (confirmed) {
                    const blocked = [];
                    player.bench.forEach((card, index) => {
                        if ((card instanceof game_1.PokemonCard && card.name === 'Dragonite EX')) {
                            blocked.push(index);
                        }
                    });
                    return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: game_1.SuperType.POKEMON, stage: game_1.Stage.BASIC }, { min: 0, max: 2, allowCancel: false, blocked: blocked }), selected => {
                        if (selected && selected.length > 0) {
                            selected.forEach(card => {
                                player.discard.moveCardsTo(selected, player.hand);
                            });
                        }
                        return state;
                    });
                }
                return state;
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Defending Pokemon has no energy cards attached
            if (!opponent.active.cards.some(c => c instanceof game_1.EnergyCard)) {
                return state;
            }
            let card;
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.active, { superType: game_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false }), selected => {
                card = selected[0];
                opponent.active.moveCardTo(card, opponent.discard);
                return state;
            });
        }
        return state;
    }
}
exports.DragoniteEX = DragoniteEX;
