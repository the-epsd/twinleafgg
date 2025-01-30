"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Togekiss = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Togekiss extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Togetic';
        this.cardType = P;
        this.hp = 150;
        this.weakness = [{ type: M }];
        this.retreat = [];
        this.powers = [{
                name: 'Precious Gift',
                powerType: game_1.PowerType.ABILITY,
                text: 'Once at the end of your turn (after your attack), you may use this Ability. Draw cards until you have 8 cards in your hand.'
            }];
        this.attacks = [{
                name: 'Power Cyclone',
                cost: [C, C],
                damage: 110,
                text: 'Move an Energy from this Pokémon to 1 of your Benched Pokémon.'
            }];
        this.set = 'OBF';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '85';
        this.name = 'Togekiss';
        this.fullName = 'Togekiss OBF';
    }
    reduceEffect(store, state, effect) {
        // Precious Gift
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            let isTogekissInPlay = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isTogekissInPlay = true;
                }
            });
            if (!isTogekissInPlay) {
                return state;
            }
            try {
                const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                store.reduceEffect(state, powerEffect);
            }
            catch (_a) {
                return state;
            }
            if (player.hand.cards.length >= 8) {
                return state;
            }
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    store.log(state, game_1.GameLog.LOG_PLAYER_USES_ABILITY, { name: player.name, card: 'Togekiss' });
                    while (player.hand.cards.length < 8 && player.deck.cards.length > 0) {
                        player.deck.moveTo(player.hand, 1);
                    }
                }
            });
        }
        // Power Cyclone
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const hasBench = player.bench.some(b => b.cards.length > 0);
            const hasEnergy = player.active.cards.some(c => {
                return c instanceof game_1.EnergyCard;
            });
            if (hasBench === false || hasEnergy === false) {
                return state;
            }
            return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.active, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: 1, max: 1 }), transfers => {
                transfers = transfers || [];
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.active.moveCardTo(transfer.card, target);
                }
            });
        }
        return state;
    }
}
exports.Togekiss = Togekiss;
