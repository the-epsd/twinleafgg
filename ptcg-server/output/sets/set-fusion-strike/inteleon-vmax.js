"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteleonVMAX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_message_1 = require("../../game/game-message");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class InteleonVMAX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_VMAX, card_types_1.CardTag.RAPID_STRIKE];
        this.regulationMark = 'E';
        this.stage = card_types_1.Stage.VMAX;
        this.evolvesFrom = 'Inteleon V';
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 320;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Double Gunner',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'You must discard a [W] Energy card from your hand in order to use this Ability. Once during your turn, you may choose 2 of your opponent\'s Benched Pokémon and put 2 damage counters on each of them.'
            }];
        this.attacks = [
            {
                name: 'Aqua Bullet',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS],
                damage: 70,
                text: 'You may put an Energy attached to this Pokémon into your hand. If you do, this attack does 70 more damage.'
            }
        ];
        this.set = 'FST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '79';
        this.name = 'Inteleon VMAX';
        this.fullName = 'Inteleon VMAX FST';
        this.DOUBLE_GUNNER_MARKER = 'DOUBLE_GUNNER_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.DOUBLE_GUNNER_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.DOUBLE_GUNNER_MARKER, this)) {
            const player = effect.player;
            player.marker.removeMarker(this.DOUBLE_GUNNER_MARKER, this);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_message_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    const energyCards = player.active.cards.filter(c => c instanceof game_1.EnergyCard);
                    const cardList = new game_1.CardList();
                    cardList.cards = energyCards;
                    state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_ENERGIES_TO_HAND, cardList, { superType: card_types_1.SuperType.ENERGY }, { max: 1, allowCancel: false }), energies => {
                        effect.damage += 70;
                        const cardsToHand = new attack_effects_1.CardsToHandEffect(effect, energies);
                        cardsToHand.target = player.active;
                        return store.reduceEffect(state, cardsToHand);
                    });
                }
                return state;
            });
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasEnergyInHand = player.hand.cards.some(c => {
                return c instanceof game_1.EnergyCard;
            });
            if (!hasEnergyInHand) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.DOUBLE_GUNNER_MARKER, this)) {
                throw new game_1.GameError(game_message_1.GameMessage.POWER_ALREADY_USED);
            }
            const hasBenched = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                return state;
            }
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, { superType: card_types_1.SuperType.ENERGY }, { allowCancel: true, min: 1, max: 1 }), cards => {
                cards = cards || [];
                if (cards.length === 0) {
                    return;
                }
                return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { min: 1, max: 2, allowCancel: false }), selected => {
                    const targets = selected || [];
                    targets.forEach(target => {
                        target.damage += 20;
                        player.marker.addMarker(this.DOUBLE_GUNNER_MARKER, this);
                    });
                });
            });
        }
        return state;
    }
}
exports.InteleonVMAX = InteleonVMAX;
