"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamRocketsSpidops = void 0;
const game_1 = require("../../game");
const energy_card_1 = require("../../game/store/card/energy-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class TeamRocketsSpidops extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Team Rocket\'s Tarountula';
        this.cardType = game_1.CardType.GRASS;
        this.hp = 130;
        this.weakness = [{ type: game_1.CardType.FIRE }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Charge Up',
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, you may attach 1 Basic Energy from your discard pile to this Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Rocket Rush',
                cost: [game_1.CardType.GRASS, game_1.CardType.COLORLESS],
                damage: 30,
                text: 'This attack does 30 damage for each of your Team Rocket\'s Pokemon in play.'
            }
        ];
        this.tags = [game_1.CardTag.TEAM_ROCKET];
        this.set = 'SV10';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '9';
        this.name = 'Team Rocket\'s Spidops';
        this.fullName = 'Team Rocket\'s Spidops SV10';
        this.CHARGE_UP_MARKER = 'CHARGE_UP_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.marker.removeMarker(this.CHARGE_UP_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const hasEnergyInDiscard = player.discard.cards.some(c => {
                return c instanceof energy_card_1.EnergyCard
                    && c.energyType === game_1.EnergyType.BASIC;
            });
            if (!hasEnergyInDiscard) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.CHARGE_UP_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_ACTIVE, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: game_1.SuperType.ENERGY, energyType: game_1.EnergyType.BASIC }, { allowCancel: false, min: 1, max: 1 }), transfers => {
                transfers = transfers || [];
                player.marker.addMarker(this.CHARGE_UP_MARKER, this);
                if (transfers.length === 0) {
                    return;
                }
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.discard.moveCardTo(transfer.card, target);
                }
                return state;
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            // Count Team Rocket's Pokemon in play
            const player = effect.player;
            let teamRocketCount = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card) => {
                if (card.tags.includes(game_1.CardTag.TEAM_ROCKET)) {
                    teamRocketCount++;
                }
            });
            // Modify damage based on count
            effect.damage = 30 * teamRocketCount;
        }
        return state;
    }
}
exports.TeamRocketsSpidops = TeamRocketsSpidops;
