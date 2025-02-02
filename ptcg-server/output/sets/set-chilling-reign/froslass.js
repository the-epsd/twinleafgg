"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Froslass = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_message_1 = require("../../game/game-message");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
function* useLeParfum(next, store, state, self, effect) {
    const player = effect.player;
    if (player.deck.cards.length === 0) {
        return state;
    }
    // Try to reduce PowerEffect, to check if something is blocking our ability
    try {
        const stub = new game_effects_1.PowerEffect(player, {
            name: 'test',
            powerType: game_1.PowerType.ABILITY,
            text: ''
        }, self);
        store.reduceEffect(state, stub);
    }
    catch (_a) {
        return state;
    }
    yield state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_message_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Water Energy' }, { allowCancel: true, min: 0, max: 1 }), transfers => {
        transfers = transfers || [];
        // cancelled by user
        if (transfers.length === 0) {
            return;
        }
        for (const transfer of transfers) {
            const target = game_1.StateUtils.getTarget(state, player, transfer.to);
            player.discard.moveCardTo(transfer.card, target);
        }
    });
}
class Froslass extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.regulationMark = 'E';
        this.evolvesFrom = 'Snorunt';
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Frost Over',
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may attach a W Energy card from your discard pile to 1 of your Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Crystal Breath',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS],
                damage: 90,
                text: 'During your next turn, this Pokémon can\'t attack.'
            }
        ];
        this.set = 'CRE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '36';
        this.name = 'Froslass';
        this.fullName = 'Froslass CRE';
        this.ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
        this.ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const generator = useLeParfum(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
            effect.player.marker.removeMarker(this.ATTACK_USED_MARKER, this);
            effect.player.marker.removeMarker(this.ATTACK_USED_2_MARKER, this);
            console.log('marker cleared');
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
            effect.player.marker.addMarker(this.ATTACK_USED_2_MARKER, this);
            console.log('second marker added');
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            // Check marker
            if (effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
                console.log('attack blocked');
                throw new game_1.GameError(game_message_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            effect.player.marker.addMarker(this.ATTACK_USED_MARKER, this);
            console.log('marker added');
        }
        return state;
    }
}
exports.Froslass = Froslass;
