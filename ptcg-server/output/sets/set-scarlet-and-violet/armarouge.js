"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Armarouge = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
function* useFireOff(next, store, state, effect) {
    const player = effect.player;
    const blockedMap = [];
    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
        store.reduceEffect(state, checkProvidedEnergy);
        const blockedCards = [];
        checkProvidedEnergy.energyMap.forEach(em => {
            if (!em.provides.includes(card_types_1.CardType.FIRE) && !em.provides.includes(card_types_1.CardType.ANY)) {
                blockedCards.push(em.card);
            }
        });
        const blocked = [];
        blockedCards.forEach(bc => {
            const index = cardList.cards.indexOf(bc);
            if (index !== -1 && !blocked.includes(index)) {
                blocked.push(index);
            }
        });
        if (blocked.length !== 0 || target.slot === game_1.SlotType.ACTIVE) {
            blockedMap.push({ source: target, blocked: target.slot === game_1.SlotType.ACTIVE ? cardList.cards.map((_, i) => i) : blocked });
        }
    });
    const blocked2 = [];
    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        if (player.active.cards[0] !== card) {
            blocked2.push(target);
        }
    });
    return store.prompt(state, new game_1.MoveEnergyPrompt(effect.player.id, game_message_1.GameMessage.MOVE_ENERGY_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], // Only allow moving from bench
    { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: 0, blockedMap, blockedTo: blocked2 }), transfers => {
        if (transfers === null) {
            return;
        }
        for (const transfer of transfers) {
            const source = game_1.StateUtils.getTarget(state, player, transfer.from);
            const target = player.active; // Always move to active Pokémon
            source.moveCardTo(transfer.card, target);
        }
    });
}
class Armarouge extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.BASIC;
        this.evolvesFrom = 'Charcadet';
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Fire Off',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'As often as you like during your turn, you may move a ' +
                    'R Energy from 1 of your Benched Pokémon to your Active ' +
                    'Pokémon.'
            }];
        this.attacks = [{
                name: 'Flame Cannon',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE, card_types_1.CardType.COLORLESS],
                damage: 90,
                text: 'Your opponent\'s Active Pokémon is now Burned.'
            }];
        this.set = 'SVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '41';
        this.name = 'Armarouge';
        this.fullName = 'Armarouge SVI';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const generator = useFireOff(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.BURNED]);
            store.reduceEffect(state, specialConditionEffect);
        }
        return state;
    }
}
exports.Armarouge = Armarouge;
