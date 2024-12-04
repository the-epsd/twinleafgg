"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Munkidori = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Munkidori extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.regulationMark = 'H';
        this.cardType = game_1.CardType.PSYCHIC;
        this.hp = 110;
        this.weakness = [{ type: game_1.CardType.DARK }];
        this.resistance = [{ type: game_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Adrena-Brain',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, if this Pokémon has any [D] Energy attached, you may move up to 3 damage counters from 1 of your Pokémon to 1 of your opponent\'s Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Mind Bend',
                cost: [game_1.CardType.PSYCHIC, game_1.CardType.COLORLESS],
                damage: 60,
                text: 'Your opponent\'s Active Pokémon is now Confused.'
            }
        ];
        this.set = 'TWM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '95';
        this.name = 'Munkidori';
        this.fullName = 'Munkidori TWM';
        this.ADRENA_BRAIN_MARKER = 'ADRENA_BRAIN_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [game_1.SpecialCondition.CONFUSED]);
            store.reduceEffect(state, specialConditionEffect);
        }
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.ADRENA_BRAIN_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.ADRENA_BRAIN_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const maxAllowedDamage = [];
            const blockedFrom = [];
            const blockedTo = [];
            if (player.marker.hasMarker(this.ADRENA_BRAIN_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            // Check if any Pokémon have damage
            let hasDamagedPokemon = false;
            const damagedPokemon = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (cardList.damage > 0) {
                    hasDamagedPokemon = true;
                    damagedPokemon.push({ target, damage: cardList.damage });
                }
            });
            if (!hasDamagedPokemon) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                const checkHpEffect = new check_effects_1.CheckHpEffect(player, cardList);
                store.reduceEffect(state, checkHpEffect);
                maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
            });
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                blockedTo.push(target);
            });
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                blockedFrom.push(target);
            });
            let hasDarkAttached = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
                    store.reduceEffect(state, checkEnergy);
                    checkEnergy.energyMap.forEach(em => {
                        var _a;
                        if (em.provides.includes(game_1.CardType.ANY)) {
                            hasDarkAttached = true;
                        }
                        if (em.provides.includes(game_1.CardType.DARK)) {
                            hasDarkAttached = true;
                        }
                        const energyCard = em.card;
                        if (energyCard instanceof game_1.EnergyCard && energyCard.provides.includes(game_1.CardType.DARK)) {
                            hasDarkAttached = true;
                        }
                        if (energyCard instanceof game_1.EnergyCard && energyCard.provides.includes(game_1.CardType.ANY)) {
                            hasDarkAttached = true;
                        }
                        if (energyCard instanceof game_1.EnergyCard && ((_a = energyCard.blendedEnergies) === null || _a === void 0 ? void 0 : _a.includes(game_1.CardType.DARK))) {
                            hasDarkAttached = true;
                        }
                    });
                    if (!hasDarkAttached) {
                        throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
                    }
                    return store.prompt(state, new game_1.RemoveDamagePrompt(effect.player.id, game_1.GameMessage.MOVE_DAMAGE, game_1.PlayerType.ANY, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], maxAllowedDamage, { min: 1, max: 3, allowCancel: false, sameTarget: true, blockedTo: blockedTo, blockedFrom: blockedFrom }), transfers => {
                        if (transfers === null) {
                            return state;
                        }
                        let totalDamageMoved = 0;
                        for (const transfer of transfers) {
                            const source = game_1.StateUtils.getTarget(state, player, transfer.from);
                            const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                            // if (source.cards.length > 1) {
                            //   throw new GameError(GameMessage.INVALID_TARGET);
                            // }
                            // if (target.cards.length > 1) {
                            //   throw new GameError(GameMessage.INVALID_TARGET);
                            // }
                            player.marker.addMarker(this.ADRENA_BRAIN_MARKER, this);
                            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                                if (cardList.getPokemonCard() === this) {
                                    cardList.addBoardEffect(game_1.BoardEffect.ABILITY_USED);
                                }
                            });
                            /*blockedFrom.forEach(blocked => {
                              if (transfer.from === blocked && transfer.to === blocked) {
                                throw new GameError(GameMessage.CANNOT_USE_POWER);;
                              }
                            });
                  
                            if (blockedFrom.includes(transfer.from)) {
                              throw new GameError(GameMessage.CANNOT_USE_POWER);
                            }*/
                            const damageToMove = Math.min(30 - totalDamageMoved, Math.min(10, source.damage));
                            if (damageToMove > 0) {
                                source.damage -= damageToMove;
                                target.damage += damageToMove;
                                totalDamageMoved += damageToMove;
                            }
                            if (totalDamageMoved >= 30)
                                break;
                        }
                    });
                }
            });
        }
        return state;
    }
}
exports.Munkidori = Munkidori;
