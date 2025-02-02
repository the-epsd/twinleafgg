"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Forretressex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Forretressex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.POKEMON_TERA];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Pineco';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 270;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Exploding Energy',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, you may search your deck for up to 5 Basic [G] Energy cards and attach them to your Pokémon in any way you like. Then, shuffle your deck. If you searched your deck in this way, this Pokémon is Knocked Out.'
            }];
        this.attacks = [
            {
                name: 'Guard Press',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.GRASS],
                damage: 120,
                text: 'During your opponent\'s next turn, this Pokémon takes 30 less damage from attacks(after applying Weakness and Resistance).'
            }
        ];
        this.set = 'PAL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '5';
        this.name = 'Forretress ex';
        this.fullName = 'Forretress ex PAL';
        this.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER = 'DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER';
        this.CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER = 'CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const hasEnergyInHand = player.discard.cards.some(c => {
                return c instanceof game_1.EnergyCard;
            });
            if (!hasEnergyInHand) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const blocked2 = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
                if (card.tags.includes(card_types_1.CardTag.POKEMON_EX)) {
                    blocked2.push(target);
                }
                if (card.tags.includes(card_types_1.CardTag.POKEMON_GX)) {
                    blocked2.push(target);
                }
            });
            return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: false, min: 0, max: 5, blockedTo: blocked2 }), transfers => {
                transfers = transfers || [];
                // cancelled by user
                if (transfers.length === 0) {
                    return state;
                }
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.discard.moveCardTo(transfer.card, target);
                }
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (cardList.getPokemonCard() === this) {
                        cardList.damage += 999;
                    }
                });
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            player.active.marker.addMarker(this.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this);
            opponent.marker.addMarker(this.CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this);
            console.log('marker added');
        }
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this)) {
            if (effect.target.marker.hasMarker(this.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this)) {
                effect.damage -= 30;
                return state;
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect
            && effect.player.marker.hasMarker(this.CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this)) {
            effect.player.marker.removeMarker(this.CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this);
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                cardList.marker.removeMarker(this.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this);
            });
            console.log('marker removed');
        }
        if (effect instanceof attack_effects_1.PutDamageEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Target is not Active
            if (effect.target === player.active || effect.target === opponent.active) {
                return state;
            }
            // Target is this Pokemon
            if (effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
                effect.preventDefault = true;
            }
        }
        return state;
    }
}
exports.Forretressex = Forretressex;
