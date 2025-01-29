"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrevenantDusknoirGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class TrevenantDusknoirGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.TAG_TEAM];
        this.cardType = P;
        this.hp = 270;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Night Watch',
                cost: [P, P, P],
                damage: 150,
                text: 'Choose 2 random cards from your opponent\'s hand. Your opponent reveals those cards and shuffles them into their deck.'
            },
            {
                name: 'Pale Moon-GX',
                cost: [P, C],
                damage: 0,
                text: 'At the end of your opponent\'s next turn, the Defending Pokemon will be Knocked Out. If this Pokemon has at least 1 extra [P] Energy attached to it (in addition to this attack\'s cost), discard all Energy from your opponent\'s Active Pokemon. (You can\'t use more than 1 GX attack in a game.)'
            },
        ];
        this.set = 'SMP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '217';
        this.name = 'Trevenant & Dusknoir-GX';
        this.fullName = 'Trevenant & Dusknoir-GX SMP';
        this.PALE_MOON_MARKER = 'PALE_MOON_MARKER';
        this.PALE_MOON_ACTIVATION_MARKER = 'PALE_MOON_ACTIVATION_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Night Watch
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.hand.cards.length === 0) {
                return state;
            }
            let cardsToShuffle = Math.min(2, opponent.hand.cards.length);
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.hand, {}, { allowCancel: false, min: cardsToShuffle, max: cardsToShuffle, isSecret: true }), cards => {
                cards = cards || [];
                store.prompt(state, new game_1.ShowCardsPrompt(player.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => []);
                opponent.hand.moveCardsTo(cards, opponent.deck);
                return store.prompt(state, new game_1.ShuffleDeckPrompt(opponent.id), order => {
                    opponent.deck.applyOrder(order);
                });
            });
        }
        // Pale Moon-GX
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.usedGX) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_GX_USED);
            }
            player.usedGX = true;
            opponent.active.marker.addMarker(this.PALE_MOON_MARKER, this);
            opponent.marker.addMarker(this.PALE_MOON_ACTIVATION_MARKER, this);
            // Check for the extra energy cost.
            const extraEffectCost = [P, P, C];
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergy);
            const meetsExtraEffectCost = game_1.StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, extraEffectCost);
            if (!meetsExtraEffectCost) {
                return state;
            }
            // if we have the energies, discard the energies
            const opponentEnergy = new check_effects_1.CheckProvidedEnergyEffect(opponent, opponent.active);
            state = store.reduceEffect(state, opponentEnergy);
            const oppCards = [];
            opponentEnergy.energyMap.forEach(em => {
                oppCards.push(em.card);
            });
            const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, oppCards);
            discardEnergy.target = opponent.active;
            store.reduceEffect(state, discardEnergy);
        }
        // hitman times
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.PALE_MOON_ACTIVATION_MARKER, this)) {
            // kill em.
            if (effect.player.active.marker.hasMarker(this.PALE_MOON_MARKER, this)) {
                effect.player.active.damage += 999;
            }
            // wipe the evidence
            effect.player.marker.removeMarker(this.PALE_MOON_ACTIVATION_MARKER, this);
            effect.player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                cardList.marker.removeMarker(this.PALE_MOON_MARKER, this);
            });
        }
        return state;
    }
}
exports.TrevenantDusknoirGX = TrevenantDusknoirGX;
