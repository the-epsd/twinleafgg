"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GarchompGiratinaGX = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class GarchompGiratinaGX extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [game_1.CardTag.TAG_TEAM];
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.DRAGON;
        this.hp = 270;
        this.weakness = [{ type: game_1.CardType.FAIRY }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.set = 'UNM';
        this.setNumber = '146';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Garchomp & Giratina-GX';
        this.fullName = 'Garchomp & Giratina-GX UNM';
        this.attacks = [
            {
                name: 'Linear Attack',
                cost: [game_1.CardType.COLORLESS],
                damage: 0,
                text: 'This attack does 40 damage to 1 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Calamitous Slash',
                cost: [game_1.CardType.PSYCHIC, game_1.CardType.FIGHTING, game_1.CardType.COLORLESS],
                damage: 160,
                text: 'If your opponent\'s Active Pokémon already has any damage counters on it, this attack does 80 more damage.'
            },
            {
                name: 'GG End-GX',
                cost: [game_1.CardType.PSYCHIC, game_1.CardType.PSYCHIC, game_1.CardType.FIGHTING],
                damage: 0,
                text: 'Discard 1 of your opponent\'s Pokémon and all cards attached to it. If this Pokémon has at least 3 extra [F] Energy attached to it (in addition to this attack\'s cost), discard 2 of your opponent\'s Pokémon instead. (You can\'t use more than 1 GX attack in a game.)'
            },
        ];
    }
    reduceEffect(store, state, effect) {
        // Linear Attack
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { allowCancel: false }), targets => {
                if (!targets || targets.length === 0) {
                    return;
                }
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 40);
                damageEffect.target = targets[0];
                store.reduceEffect(state, damageEffect);
            });
        }
        // Calamitous Slash
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.active.damage > 0) {
                effect.damage += 80;
            }
        }
        // GG End-GX
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[2]) {
            const player = effect.player;
            const opponent = effect.opponent;
            if (player.usedGX == true) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_GX_USED);
            }
            player.usedGX = true;
            let amountToDiscard = 1;
            const extraEffectCost = [game_1.CardType.PSYCHIC, game_1.CardType.PSYCHIC, game_1.CardType.FIGHTING, game_1.CardType.FIGHTING, game_1.CardType.FIGHTING, game_1.CardType.FIGHTING];
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergy);
            const meetsExtraEffectCost = game_1.StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, extraEffectCost);
            if (meetsExtraEffectCost) {
                const benched = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
                if (benched === 0) {
                    return state;
                }
                amountToDiscard = Math.min(2, benched + 1);
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_PICK_UP, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: amountToDiscard, max: amountToDiscard, allowCancel: false }), selection => {
                selection.forEach(r => {
                    r.moveTo(opponent.discard);
                    r.clearEffects();
                });
            });
        }
        return state;
    }
}
exports.GarchompGiratinaGX = GarchompGiratinaGX;
