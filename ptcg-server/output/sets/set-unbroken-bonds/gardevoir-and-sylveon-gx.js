"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GardevoirSylveonGX = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class GardevoirSylveonGX extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [game_1.CardTag.TAG_TEAM];
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.FAIRY;
        this.hp = 260;
        this.weakness = [{ type: game_1.CardType.METAL }];
        this.resistance = [{ type: game_1.CardType.DARK, value: -20 }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.set = 'UNB';
        this.setNumber = '130';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Gardevoir & Sylveon-GX';
        this.fullName = 'Gardevoir & Sylveon-GX UNB';
        this.attacks = [
            {
                name: 'Fairy Song',
                cost: [game_1.CardType.COLORLESS],
                damage: 0,
                text: 'Search your deck for up to 2 [Y] Energy cards and attach them to your Benched Pokemon in any ' +
                    'way you like. Then, shuffle your deck.'
            },
            {
                name: 'Kaleidostorm',
                cost: [game_1.CardType.FAIRY, game_1.CardType.FAIRY, game_1.CardType.COLORLESS],
                damage: 150,
                text: 'Move any number of Energy from your Pokemon to your other Pokemon in any way you like.'
            },
            {
                name: 'Magical Miracle-GX',
                cost: [game_1.CardType.FAIRY, game_1.CardType.FAIRY, game_1.CardType.FAIRY],
                damage: 200,
                text: 'If this Pokemon has at least 3 extra [Y] Energy attached to it (in addition to this attack\'s cost), ' +
                    'your opponent shuffles their hand into their deck. (You can\'t use more than 1 GX attack in a game.)'
            },
        ];
    }
    reduceEffect(store, state, effect) {
        // Fairy Song
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const hasBench = player.bench.some(b => b.cards.length > 0);
            if (hasBench === false) {
                return state;
            }
            store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, player.deck, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: game_1.SuperType.ENERGY, name: 'Fairy Energy' }, { allowCancel: false, min: 0, max: 2 }), transfers => {
                transfers = transfers || [];
                // cancelled by user
                if (transfers.length === 0) {
                    return;
                }
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.deck.moveCardTo(transfer.card, target);
                }
            });
        }
        // Kaleidostorm
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            return store.prompt(state, new game_1.MoveEnergyPrompt(player.id, game_1.GameMessage.MOVE_ENERGY_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { superType: game_1.SuperType.ENERGY }, { allowCancel: true }), transfers => {
                if (transfers === null) {
                    return;
                }
                for (const transfer of transfers) {
                    const source = game_1.StateUtils.getTarget(state, player, transfer.from);
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    source.moveCardTo(transfer.card, target);
                }
            });
        }
        // Magical Miracle-GX
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[2]) {
            const player = effect.player;
            const opponent = effect.opponent;
            if (player.usedGX == true) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_GX_USED);
            }
            player.usedGX = true;
            const extraEffectCost = [game_1.CardType.FAIRY, game_1.CardType.FAIRY, game_1.CardType.FAIRY, game_1.CardType.FAIRY, game_1.CardType.FAIRY, game_1.CardType.FAIRY];
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergy);
            const meetsExtraEffectCost = game_1.StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, extraEffectCost);
            if (meetsExtraEffectCost) {
                opponent.hand.moveTo(opponent.deck);
                return store.prompt(state, new game_1.ShuffleDeckPrompt(opponent.id), order => {
                    opponent.deck.applyOrder(order);
                });
            }
        }
        return state;
    }
}
exports.GardevoirSylveonGX = GardevoirSylveonGX;
