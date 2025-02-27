"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MegaLucarioex = void 0;
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MegaLucarioex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Riolu';
        this.tags = [game_1.CardTag.POKEMON_SV_MEGA, game_1.CardTag.POKEMON_ex];
        this.cardType = F;
        this.hp = 340;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Aura Jab',
                cost: [F],
                damage: 130,
                text: 'Attach up to 3 Basic [F] Energy cards from your discard pile to your Benched Pokemon in any way you like.',
            },
            {
                name: 'Mega Brave',
                cost: [F, F],
                damage: 270,
                text: 'During your next turn, this Pokemon can\'t use Mega Brave.',
            }
        ];
        this.regulationMark = 'I';
        this.set = 'M1L';
        this.setNumber = '29';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Mega Lucario ex';
        this.fullName = 'Mega Lucario ex M1L';
        this.MEGA_BRAVE_MARKER = 'MEGA_BRAVE_MARKER';
        this.CLEAR_MEGA_BRAVE_MARKER = 'CLEAR_MEGA_BRAVE_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Aura Jab
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: game_1.SuperType.ENERGY, energyType: game_1.EnergyType.BASIC, name: 'Fighting Energy' }, { allowCancel: false, min: 0, max: 3 }), transfers => {
                transfers = transfers || [];
                // cancelled by user
                if (transfers.length === 0) {
                    return state;
                }
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.discard.moveCardTo(transfer.card, target);
                }
            });
        }
        // Mega Brave
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            if (prefabs_1.HAS_MARKER(this.MEGA_BRAVE_MARKER, effect.player, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            prefabs_1.ADD_MARKER(this.MEGA_BRAVE_MARKER, effect.player, this);
            effect.player.marker.addMarker(this.MEGA_BRAVE_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.MEGA_BRAVE_MARKER, this)) {
            if (!effect.player.marker.hasMarker(this.CLEAR_MEGA_BRAVE_MARKER, this)) {
                effect.player.marker.addMarker(this.CLEAR_MEGA_BRAVE_MARKER, this);
            }
            else if (effect.player.marker.hasMarker(this.CLEAR_MEGA_BRAVE_MARKER, this)) {
                effect.player.marker.removeMarker(this.MEGA_BRAVE_MARKER, this);
                effect.player.marker.removeMarker(this.CLEAR_MEGA_BRAVE_MARKER, this);
            }
        }
        return state;
    }
}
exports.MegaLucarioex = MegaLucarioex;
