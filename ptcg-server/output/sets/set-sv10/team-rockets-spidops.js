"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamRocketsSpidops = void 0;
const game_1 = require("../../game");
const energy_card_1 = require("../../game/store/card/energy-card");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
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
                useWhenInPlay: true,
                text: 'Once during your turn, you may attach 1 Basic Energy from your discard pile to this Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Rocket Rush',
                cost: [game_1.CardType.GRASS, game_1.CardType.COLORLESS],
                damage: 30,
                damageCalculation: 'x',
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
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
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
            const cardList = game_1.StateUtils.findCardList(state, this);
            if (cardList === undefined) {
                return state;
            }
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_ATTACH, player.discard, { superType: game_1.SuperType.ENERGY, energyType: game_1.EnergyType.BASIC }, { min: 1, max: 1, allowCancel: false }), cards => {
                cards = cards || [];
                if (cards.length > 0) {
                    player.marker.addMarker(this.CHARGE_UP_MARKER, this);
                    player.discard.moveCardsTo(cards, cardList);
                }
            });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
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
