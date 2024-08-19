"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Archaludonex = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Archaludonex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [game_1.CardTag.POKEMON_ex];
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Duraludon';
        this.cardType = game_1.CardType.METAL;
        this.hp = 300;
        this.weakness = [{ type: game_1.CardType.FIRE }];
        this.resistance = [{ type: game_1.CardType.GRASS, value: -30 }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Energy Attachment',
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokémon from your hand to evolve 1 of your Pokemon during your turn, you may attach 2 Basic [M] Energy from your discard pile to your Pokémon in any way you like.'
            }];
        this.attacks = [{
                name: 'Metal Defender',
                cost: [game_1.CardType.METAL, game_1.CardType.METAL, game_1.CardType.METAL],
                damage: 220,
                text: 'During your opponent\'s next turn, this Pokemon has no Weakness.'
            }];
        this.set = 'SET_CODE_HERE';
        this.setNumber = '37';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Archaludon ex';
        this.fullName = 'Archaludon ex SET_CODE_HERE';
        this.METAL_DEFENDER_MARKER = 'METAL_DEFENDER_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            return store.prompt(state, new game_1.ConfirmPrompt(player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_ACTIVE, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: game_1.SuperType.ENERGY, energyType: game_1.EnergyType.BASIC }, { allowCancel: false, min: 1, max: 2 }), transfers => {
                        transfers = transfers || [];
                        if (transfers.length === 0) {
                            return;
                        }
                        for (const transfer of transfers) {
                            const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                            player.discard.moveCardTo(transfer.card, target);
                        }
                    });
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            player.marker.addMarker(this.METAL_DEFENDER_MARKER, this);
            console.log('marker added');
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.target.cards.includes(this)) {
            if (effect.target.marker.hasMarker(this.METAL_DEFENDER_MARKER, this)) {
                effect.ignoreWeakness == true;
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.METAL_DEFENDER_MARKER, this);
            console.log('marker removed');
        }
        return state;
    }
}
exports.Archaludonex = Archaludonex;
