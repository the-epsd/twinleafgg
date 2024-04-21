"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blisseyex = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
function* useBlissfulSwap(next, store, state, effect) {
    const player = effect.player;
    const blockedMap = [];
    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
        store.reduceEffect(state, checkProvidedEnergy);
        const blockedCards = [];
        checkProvidedEnergy.energyMap.forEach(em => {
            if (!em.provides.includes(card_types_1.CardType.ANY)) {
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
        if (blocked.length !== 0) {
            blockedMap.push({ source: target, blocked });
        }
    });
    let hasEnergyOnBench = false;
    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (cardList === player.active) {
            blockedTo.push(target);
            return;
        }
        blockedFrom.push(target);
        if (cardList.cards.some(c => c instanceof game_1.EnergyCard)) {
            hasEnergyOnBench = true;
        }
    });
    if (hasEnergyOnBench === false) {
        return state;
    }
    const blockedFrom = [];
    const blockedTo = [];
    return store.prompt(state, new game_1.MoveEnergyPrompt(player.id, game_1.GameMessage.MOVE_ENERGY_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], // Only allow moving to active
    { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: true, blockedFrom, blockedTo, blockedMap, min: 1, max: 1 }), transfers => {
        if (!transfers) {
            return;
        }
        for (const transfer of transfers) {
            // Can only move energy to the active Pokemon
            const target = player.active;
            const source = game_1.StateUtils.getTarget(state, player, transfer.from);
            source.moveCardTo(transfer.card, target);
        }
    });
}
class Blisseyex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.evolvesFrom = 'Chansey';
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.regulationMark = 'H';
        this.cardType = card_types_1.CardType.COLORLESS;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.hp = 310;
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Blissful Swap',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, you may move 1 Basic Energy from 1 of your Pokémon to another of your Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Return',
                cost: [],
                damage: 120,
                text: 'You may draw until you have 6 cards in hand.'
            }
        ];
        this.set = 'SV6';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '85';
        this.name = 'Blissey ex';
        this.fullName = 'Blissey ex SV6';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const generator = useBlissfulSwap(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    while (player.hand.cards.length < 6) {
                        player.deck.moveTo(player.hand, 1);
                    }
                }
            });
        }
        return state;
    }
}
exports.Blisseyex = Blisseyex;
