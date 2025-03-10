"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jirachi = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Jirachi extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.FIRE, value: +20 }];
        this.resistance = [{ type: card_types_1.CardType.PSYCHIC, value: -20 }];
        this.retreat = [];
        this.powers = [{
                name: 'Final Wish',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.POKEPOWER,
                text: 'Once during your opponent\’s turn, if Jirachi would be Knocked Out by damage from an attack, you may search your deck for any 1 card and put it into your hand. Shuffle your deck afterward.'
            }];
        this.attacks = [
            {
                name: 'Detour',
                cost: [],
                damage: 0,
                text: 'If you have a Supporter card in play, use the effect of that card as the effect of this attack.'
            },
            {
                name: 'Swift',
                cost: [card_types_1.CardType.METAL],
                damage: 20,
                text: 'This attack\’s damage isn\’t affected by Weakness, Resistance, Poké-Powers, Poké-Bodies, or any other effects on the Defending Pokémon.'
            }
        ];
        this.set = 'RR';
        this.setNumber = '7';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Jirachi';
        this.fullName = 'Jirachi RR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target.cards.includes(this) && effect.player.marker.hasMarker(effect.player.DAMAGE_DEALT_MARKER)) {
            // This Pokemon was knocked out
            const player = effect.player;
            if (prefabs_1.IS_POKEPOWER_BLOCKED(store, state, player, this)) {
                return state;
            }
            return store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    let cards = [];
                    return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {}, { min: 1, max: 1, allowCancel: false }), (selected) => {
                        cards = selected || [];
                        if (cards.length > 0) {
                            player.deck.moveCardsTo(cards, player.hand);
                        }
                        prefabs_1.SHUFFLE_DECK(store, state, player);
                    });
                }
            });
        }
        if (effect instanceof play_card_effects_1.PlaySupporterEffect) {
            const player = effect.player;
            if (!player.supportersForDetour.cards.includes(effect.trainerCard)) {
                player.supportersForDetour.cards.push(effect.trainerCard);
            }
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            if (player.supportersForDetour.cards.length == 0) {
                return state;
            }
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_COPY_EFFECT, player.supportersForDetour, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.SUPPORTER }, { allowCancel: false, min: 1, max: 1 }), cards => {
                const trainerCard = cards[0];
                player.supporterTurn -= 1;
                const playTrainerEffect = new play_card_effects_1.TrainerEffect(player, trainerCard);
                store.reduceEffect(state, playTrainerEffect);
            });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const damage = 20; // Direct damage without weakness
            effect.damage = 0;
            if (damage > 0) {
                opponent.active.damage += damage;
                const afterDamage = new attack_effects_1.AfterDamageEffect(effect, damage);
                state = store.reduceEffect(state, afterDamage);
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.supportersForDetour.cards = [];
        }
        return state;
    }
}
exports.Jirachi = Jirachi;
