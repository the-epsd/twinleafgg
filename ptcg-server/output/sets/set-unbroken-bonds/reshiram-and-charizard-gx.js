"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReshiramCharizardGX = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class ReshiramCharizardGX extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [game_1.CardTag.TAG_TEAM];
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.FIRE;
        this.hp = 270;
        this.weakness = [{ type: game_1.CardType.WATER }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Outrage',
                cost: [game_1.CardType.FIRE, game_1.CardType.COLORLESS],
                damage: 30,
                text: 'This attack does 10 more damage for each damage counter on this Pokemon.'
            },
            {
                name: 'Flare Strike',
                cost: [game_1.CardType.FIRE, game_1.CardType.FIRE, game_1.CardType.FIRE, game_1.CardType.COLORLESS],
                damage: 230,
                text: 'This Pokemon can\'t use Flare Strike during your next turn.'
            },
            {
                name: 'Double Blaze-GX',
                cost: [game_1.CardType.FIRE, game_1.CardType.FIRE, game_1.CardType.FIRE],
                damage: 200,
                shred: false,
                gxAttack: true,
                text: 'If this Pokemon has at least 3 extra R Energy attached to it (in addition to this attack\'s cost), ' +
                    'this attack does 100 more damage, and this attack\'s damage isn\'t affected by any effects on your ' +
                    'opponent\'s Active Pokemon. (You can\'t use more than 1 GX attack in a game.)'
            },
        ];
        this.set = 'UNB';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '20';
        this.name = 'Reshiram & Charizard-GX';
        this.fullName = 'Reshiram & Charizard-GX UNB';
        this.ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
        this.ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Outrage
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const cardList = game_1.StateUtils.findCardList(state, this);
            if (!(cardList instanceof game_1.PokemonCardList)) {
                return state;
            }
            effect.damage += cardList.damage;
        }
        // Flare Strike
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const marker = effect.player.marker;
            if (marker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            marker.addMarker(this.ATTACK_USED_MARKER, this);
        }
        // Flare Strike -- Some silly-looking code to handle the attack next turn logic
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const marker = effect.player.marker;
            marker.removeMarker(this.ATTACK_USED_2_MARKER, this);
            if (marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
                marker.removeMarker(this.ATTACK_USED_MARKER, this);
                marker.addMarker(this.ATTACK_USED_2_MARKER, this);
            }
        }
        // Double Blaze-GX
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[2]) {
            const player = effect.player;
            const opponent = effect.opponent;
            if (player.usedGX == true) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_GX_USED);
            }
            player.usedGX = true;
            const extraEffectCost = [game_1.CardType.FIRE, game_1.CardType.FIRE, game_1.CardType.FIRE, game_1.CardType.FIRE, game_1.CardType.FIRE, game_1.CardType.FIRE];
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergy);
            const meetsExtraEffectCost = game_1.StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, extraEffectCost);
            if (meetsExtraEffectCost) {
                this.attacks[0].shred === true;
                const applyWeakness = new attack_effects_1.ApplyWeaknessEffect(effect, effect.damage + 100);
                store.reduceEffect(state, applyWeakness);
                const damage = applyWeakness.damage;
                effect.damage = 0;
                if (damage > 0) {
                    opponent.active.damage += damage;
                    const afterDamage = new attack_effects_1.AfterDamageEffect(effect, damage);
                    state = store.reduceEffect(state, afterDamage);
                }
            }
        }
        return state;
    }
}
exports.ReshiramCharizardGX = ReshiramCharizardGX;
