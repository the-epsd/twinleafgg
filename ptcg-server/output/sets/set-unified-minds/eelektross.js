"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EelektrossUNM = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class EelektrossUNM extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Eelektrik';
        this.cardType = game_1.CardType.LIGHTNING;
        this.hp = 150;
        this.weakness = [{ type: game_1.CardType.FIGHTING }];
        this.resistance = [{ type: game_1.CardType.METAL, value: -20 }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS,];
        this.set = 'UNM';
        this.setNumber = '66';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Eelektross';
        this.fullName = 'Eelektross UNM';
        this.powers = [
            {
                name: 'Electric Swamp',
                powerType: game_1.PowerType.ABILITY,
                useFromHand: true,
                text: 'Once during your turn (before your attack), if this Pokemon is in your hand and you have at ' +
                    'least 4 L Energy cards in play, you may play this Pokemon onto your Bench. If you do, move any number of ' +
                    'L Energy from your other Pokemon to this Pokemon.'
            }
        ];
        this.attacks = [
            {
                name: 'Hover Over',
                cost: [game_1.CardType.LIGHTNING, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 130,
                text: 'The Defending Pokemon can\'t retreat during your opponent\'s next turn',
            }
        ];
    }
    reduceEffect(store, state, effect) {
        // Electric Swamp
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            // Can't bench this Pokemon unless we have 4 Lightning Energy cards in play.
            const energyCards = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                cardList.cards.filter(c => ((c instanceof game_1.EnergyCard) && (!energyCards.includes(c)) &&
                    (c.provides.includes(game_1.CardType.LIGHTNING) || c.provides.includes(game_1.CardType.ANY)))).forEach(c => energyCards.push(c));
            });
            if (energyCards.length < 4)
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            // Bench this Pokemon to the desired slot.
            prefabs_1.PLAY_POKEMON_FROM_HAND_TO_BENCH(state, player, this);
            // Then, prompt player to move Lightning energy from their other Pokemon to this one.
            const blockedFrom = [];
            const blockedTo = [];
            const blockedMap = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                // We can only move from other Pokemon to this one.
                if (card === this) {
                    blockedFrom.push(target);
                }
                else {
                    blockedTo.push(target);
                }
                const blocked = [];
                const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
                store.reduceEffect(state, checkProvidedEnergy);
                checkProvidedEnergy.energyMap.forEach(em => {
                    if (!em.provides.includes(game_1.CardType.LIGHTNING) && !em.provides.includes(game_1.CardType.ANY)) {
                        const index = cardList.cards.indexOf(em.card);
                        if (index !== -1 && !blocked.includes(index)) {
                            blocked.push(index);
                        }
                    }
                });
                if (blocked.length !== 0) {
                    blockedMap.push({ source: target, blocked });
                }
            });
            return store.prompt(state, new game_1.MoveEnergyPrompt(player.id, game_1.GameMessage.MOVE_ENERGY_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { superType: game_1.SuperType.ENERGY }, { allowCancel: true, blockedFrom, blockedTo, blockedMap }), transfers => {
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
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.active.marker.addMarker(game_1.PokemonCardList.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        }
        if (effect instanceof check_effects_1.CheckRetreatCostEffect &&
            effect.player.active.marker.hasMarker(game_1.PokemonCardList.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this)) {
            throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.active.marker.removeMarker(game_1.PokemonCardList.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        }
        return state;
    }
}
exports.EelektrossUNM = EelektrossUNM;
