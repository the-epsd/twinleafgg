"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VolcanionEX = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class VolcanionEX extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.cardType = R;
        this.additionalCardTypes = [W];
        this.stage = game_1.Stage.BASIC;
        this.hp = 180;
        this.weakness = [{ type: W }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Steam Up',
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), you may discard a [R] Energy card from your hand. If you do, during this turn, your Basic [R] Pokémon\'s attacks do 30 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).'
            }];
        this.attacks = [{
                name: 'Volcanic Heat',
                cost: [R, R, C],
                damage: 130,
                text: 'This Pokémon can\'t attack during your next turn.'
            }];
        this.set = 'STS';
        this.setNumber = '26';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Volcanion EX';
        this.fullName = 'Volcanion EX STS';
        this.ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
        this.ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';
        this.STEAM_UP_MARKER = 'STEAM_UP_MARKER';
    }
    reduceEffect(store, state, effect) {
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
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            effect.player.marker.addMarker(this.ATTACK_USED_MARKER, this);
            console.log('marker added');
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.hand.cards.filter(c => c instanceof game_1.EnergyCard && c.energyType === game_1.EnergyType.BASIC && c.name === 'Fire Energy').length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, { superType: game_1.SuperType.ENERGY, energyType: game_1.EnergyType.BASIC, name: 'Fire Energy' }, { min: 1, max: 1, allowCancel: false }), selected => {
                if (selected && selected.length > 0) {
                    const energy = selected[0];
                    player.hand.moveCardTo(energy, player.discard);
                    player.marker.addMarker(this.STEAM_UP_MARKER, this);
                }
            });
        }
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.player.marker.hasMarker(this.STEAM_UP_MARKER)) {
            const source = effect.source.getPokemonCard();
            if (source && source.stage === game_1.Stage.BASIC && source.cardType === game_1.CardType.FIRE) {
                effect.damage += 30;
            }
        }
        return state;
    }
}
exports.VolcanionEX = VolcanionEX;
