"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PheromosaBuzzwoleGX = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class PheromosaBuzzwoleGX extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [game_1.CardTag.TAG_TEAM, game_1.CardTag.ULTRA_BEAST];
        this.stage = game_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 260;
        this.weakness = [{ type: R }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Jet Punch',
                cost: [G],
                damage: 30,
                text: 'This attack does 30 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Elegant Sole',
                cost: [G, G, C],
                damage: 190,
                text: 'During your next turn, this Pokémon\'s Elegant Sole attack\'s base damage is 60.'
            },
            {
                name: 'Beast Game-GX',
                cost: [G],
                damage: 50,
                shred: false,
                gxAttack: true,
                text: 'If your opponent\'s Pokémon is Knocked Out by damage from this attack, take 1 more Prize card. If this Pokémon has at least 7 extra Energy attached to it (in addition to this attack\'s cost), take 3 more Prize cards instead. (You can\'t use more than 1 GX attack in a game.)'
            },
        ];
        this.set = 'UNB';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '1';
        this.name = 'Pheromosa & Buzzwole-GX';
        this.fullName = 'Pheromosa & Buzzwole-GX UNB';
        this.ELEGANT_SOLE_MARKER = 'ELEGANT_SOLE_MARKER';
        this.ELEGANT_SOLE_MARKER_2 = 'ELEGANT_SOLE_MARKER_2';
        this.usedBaseBeastGame = false;
        this.usedEnhancedBeastGame = false;
    }
    reduceEffect(store, state, effect) {
        // Jet Punch (literally just buzzwole-gx's first attack)
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            this.usedBaseBeastGame = false;
            this.usedEnhancedBeastGame = false;
            const hasBenched = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                return state;
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                if (!targets || targets.length === 0) {
                    return;
                }
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 30);
                damageEffect.target = targets[0];
                store.reduceEffect(state, damageEffect);
            });
        }
        // Elegant Sole
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            this.usedBaseBeastGame = false;
            this.usedEnhancedBeastGame = false;
            const marker = effect.player.marker;
            if (marker.hasMarker(this.ELEGANT_SOLE_MARKER_2, this)) {
                effect.damage = 60;
            }
            marker.addMarker(this.ELEGANT_SOLE_MARKER, this);
        }
        // Elegant Sole marker gaming
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const marker = effect.player.marker;
            marker.removeMarker(this.ELEGANT_SOLE_MARKER_2, this);
            if (marker.hasMarker(this.ELEGANT_SOLE_MARKER, this)) {
                marker.removeMarker(this.ELEGANT_SOLE_MARKER, this);
                marker.addMarker(this.ELEGANT_SOLE_MARKER_2, this);
            }
        }
        // Beast Game-GX
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[2]) {
            const player = effect.player;
            if (player.usedGX == true) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_GX_USED);
            }
            player.usedGX = true;
            this.usedBaseBeastGame = true;
            const extraEffectCost = [G, C, C, C, C, C, C, C];
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergy);
            const meetsExtraEffectCost = game_1.StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, extraEffectCost);
            if (meetsExtraEffectCost) {
                this.usedEnhancedBeastGame = true;
            }
        }
        // Beast Game extra prizes thing
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target === effect.player.active) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Do not activate between turns, or when it's not opponents turn.
            if (state.phase !== game_1.GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
                return state;
            }
            // Iron Hands wasn't attacking
            const pokemonCard = opponent.active.getPokemonCard();
            if (pokemonCard !== this) {
                return state;
            }
            // check if the gx attack killed
            if (this.usedBaseBeastGame === true) {
                if (effect.prizeCount > 0) {
                    effect.prizeCount += 1;
                    this.usedBaseBeastGame = false;
                    // additional effect from gx attack
                    if (this.usedEnhancedBeastGame) {
                        effect.prizeCount += 2;
                        this.usedEnhancedBeastGame = false;
                    }
                }
            }
            return state;
        }
        return state;
    }
}
exports.PheromosaBuzzwoleGX = PheromosaBuzzwoleGX;
