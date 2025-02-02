"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShadowRiderCalyrexVMAX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class ShadowRiderCalyrexVMAX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.VMAX;
        this.evolvesFrom = 'Shadow Rider Calyrex V';
        this.regulationMark = 'E';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.tags = [card_types_1.CardTag.POKEMON_VMAX];
        this.hp = 320;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Underworld Door',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, you may attach a [P] Energy card from your hand to 1 of your Benched [P] Pokémon. If you attached Energy to a Pokémon in this way, draw 2 cards.'
            }];
        this.attacks = [
            {
                name: 'Max Geist',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 10,
                text: 'This attack does 30 more damage for each [P] Energy attached to all of your Pokémon.'
            }
        ];
        this.set = 'CRE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '75';
        this.name = 'Shadow Rider Calyrex VMAX';
        this.fullName = 'Shadow Rider Calyrex VMAX CRE';
        this.UNDERWORLD_DOOR_MARKER = 'UNDERWORLD_DOOR_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.UNDERWORLD_DOOR_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const hasBench = player.bench.some(b => b.cards.length > 0);
            if (!hasBench) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const hasEnergyInHand = player.hand.cards.some(c => {
                return c instanceof game_1.EnergyCard
                    && c.energyType === card_types_1.EnergyType.BASIC
                    && c.provides.includes(card_types_1.CardType.PSYCHIC);
            });
            if (!hasEnergyInHand) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.UNDERWORLD_DOOR_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            const blocked = [];
            player.bench.forEach((card, index) => {
                if (card instanceof pokemon_card_1.PokemonCard && card.cardType === card_types_1.CardType.PSYCHIC) {
                    blocked.push(index);
                }
            });
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.hand, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Psychic Energy' }, { allowCancel: true, min: 1, max: 1, blocked: blocked }), transfers => {
                transfers = transfers || [];
                // cancelled by user
                if (transfers.length === 0) {
                    return state;
                }
                for (const transfer of transfers) {
                    player.marker.addMarker(this.UNDERWORLD_DOOR_MARKER, this);
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.hand.moveCardTo(transfer.card, target);
                }
                player.deck.moveTo(player.hand, 2);
            });
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.UNDERWORLD_DOOR_MARKER, this)) {
            effect.player.marker.removeMarker(this.UNDERWORLD_DOOR_MARKER, this);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            if (cardList === undefined) {
                return state;
            }
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_ATTACH, player.discard, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Psychic Energy' }, { min: 0, max: 2, allowCancel: true }), cards => {
                cards = cards || [];
                if (cards.length > 0) {
                    player.discard.moveCardsTo(cards, cardList);
                }
                return state;
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            let energies = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
                store.reduceEffect(state, checkProvidedEnergyEffect);
                checkProvidedEnergyEffect.energyMap.forEach(energy => {
                    energies += energy.provides.length;
                });
            });
            effect.damage = 10 + energies * 30;
        }
        return state;
    }
}
exports.ShadowRiderCalyrexVMAX = ShadowRiderCalyrexVMAX;
