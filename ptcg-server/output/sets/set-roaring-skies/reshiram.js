"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reshiram = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const costs_1 = require("../../game/store/prefabs/costs");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Reshiram extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = N;
        this.weakness = [{ type: Y }];
        this.hp = 130;
        this.retreat = [C, C];
        this.powers = [
            {
                name: 'Turboblaze',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), if this Pokémon is your Active Pokémon, you may attach a [R] Energy card from your hand to 1 of your [N] Pokémon.'
            }
        ];
        this.attacks = [
            {
                name: 'Bright Wing',
                cost: [R, R, L, C],
                damage: 110,
                text: 'Discard a [R] Energy attached to this Pokémon.'
            }
        ];
        this.set = 'ROS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '63';
        this.name = 'Reshiram';
        this.fullName = 'Reshiram ROS';
        this.TURBOBLAZE_MARKER = 'TURBOBLAZE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            const hasEnergyInHand = player.hand.cards.some(c => {
                return c instanceof game_1.EnergyCard
                    && c.energyType === card_types_1.EnergyType.BASIC
                    && c.provides.includes(R);
            });
            if (prefabs_1.HAS_MARKER(this.TURBOBLAZE_MARKER, effect.player, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            if (player.active.cards[0] !== this) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (!hasEnergyInHand) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, player.hand, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Fire Energy' }, { allowCancel: false, max: 1, min: 1 }), transfers => {
                transfers = transfers || [];
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    const energyCard = transfer.card;
                    const attachEnergyEffect = new play_card_effects_1.AttachEnergyEffect(player, energyCard, target);
                    store.reduceEffect(state, attachEnergyEffect);
                }
                prefabs_1.ABILITY_USED(effect.player, this);
                prefabs_1.ADD_MARKER(this.TURBOBLAZE_MARKER, effect.player, this);
                return state;
            });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1, R);
        }
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.TURBOBLAZE_MARKER, this);
        return state;
    }
}
exports.Reshiram = Reshiram;
