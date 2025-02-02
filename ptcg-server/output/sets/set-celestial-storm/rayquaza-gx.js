"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RayquazaGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
// CES Rayquaza-GX 109 (https://limitlesstcg.com/cards/CES/109)
class RayquazaGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_GX];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 180;
        this.weakness = [{ type: card_types_1.CardType.FAIRY }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Stormy Winds',
                useWhenInPlay: false,
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokémon from your hand onto your Bench during your turn, you may discard the top 3 cards of your deck. If you do, attach a basic Energy card from your discard pile to this Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Dragon Break',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: 'This attack does 30 damage times the amount of basic [G] and basic [L] Energy attached to your Pokémon.'
            },
            {
                name: 'Tempest-GX',
                cost: [card_types_1.CardType.GRASS],
                damage: 0,
                gxAttack: true,
                text: 'Discard your hand and draw 10 cards. (You can\'t use more than 1 GX attack in a game.)'
            }
        ];
        this.set = 'CES';
        this.name = 'Rayquaza-GX';
        this.fullName = 'Rayquaza-GX CES';
        this.setNumber = '109';
        this.cardImage = 'assets/cardback.png';
    }
    reduceEffect(store, state, effect) {
        // Stormy Winds
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            // Try to reduce PowerEffect, to check if something is blocking our ability
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
            // Check if there's any basic energy in the discard pile
            const hasBasicEnergyInDiscard = player.discard.cards.some(c => c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC);
            if (!hasBasicEnergyInDiscard) {
                return state;
            }
            if (hasBasicEnergyInDiscard) {
                state = store.prompt(state, new game_1.ConfirmPrompt(player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                    if (wantToUse) {
                        // Discard top 3 cards from the deck
                        player.deck.moveTo(player.discard, 3);
                        const blockedTo = [];
                        player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                            if (card !== this) {
                                blockedTo.push(target);
                            }
                        });
                        // Prompt to attach 1 basic energy from discard
                        state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: false, min: 1, max: 1, blockedTo, sameTarget: true }), transfers => {
                            transfers = transfers || [];
                            if (transfers.length === 0) {
                                return;
                            }
                            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                                if (cardList.getPokemonCard() === this) {
                                    cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                                }
                            });
                            for (const transfer of transfers) {
                                const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                                player.discard.moveCardTo(transfer.card, target);
                            }
                        });
                    }
                });
            }
        }
        // Dragon Break
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            let grassAndLightningEnergies = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
                store.reduceEffect(state, checkProvidedEnergyEffect);
                checkProvidedEnergyEffect.energyMap.forEach(energy => {
                    if (energy.provides.includes(card_types_1.CardType.GRASS) || energy.provides.includes(card_types_1.CardType.LIGHTNING)) {
                        grassAndLightningEnergies += 1;
                    }
                });
            });
            effect.damage = grassAndLightningEnergies * 30;
        }
        // Tempest-GX
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            // Check if player has used GX attack
            if (player.usedGX == true) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_GX_USED);
            }
            // set GX attack as used for game
            player.usedGX = true;
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const cards = player.hand.cards.filter(c => c !== this);
            player.hand.moveCardsTo(cards, player.discard);
            player.deck.moveTo(player.hand, 10);
        }
        return state;
    }
}
exports.RayquazaGX = RayquazaGX;
