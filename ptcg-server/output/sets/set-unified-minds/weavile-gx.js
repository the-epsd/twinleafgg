"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeavileGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
function* useShadowConnection(next, store, state, effect) {
    const player = effect.player;
    const blockedMap = [];
    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
        store.reduceEffect(state, checkProvidedEnergy);
        const blockedCards = [];
        checkProvidedEnergy.energyMap.forEach(em => {
            if (!em.provides.includes(D) || em.card.energyType !== card_types_1.EnergyType.BASIC) {
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
    return store.prompt(state, new game_1.MoveEnergyPrompt(effect.player.id, game_1.GameMessage.MOVE_ENERGY_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY }, { allowCancel: true, blockedMap }), transfers => {
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
class WeavileGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.tags = [card_types_1.CardTag.POKEMON_GX];
        this.evolvesFrom = 'Sneasel';
        this.cardType = D;
        this.hp = 200;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -30 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Shadow Connection',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'As often as you like during your turn (before your attack), you may move a basic [D] Energy from 1 of your Pokémon to another of your Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Claw Slash',
                cost: [D, D, C],
                damage: 130,
                text: ''
            },
            {
                name: 'Nocturnal Maneuvers-GX',
                cost: [C],
                damage: 0,
                text: 'Search your deck for any number of Basic Pokémon and put them onto your Bench. Then, shuffle your deck. (You can\'t use more than 1 GX attack in a game.)'
            }
        ];
        this.set = 'UNM';
        this.name = 'Weavile-GX';
        this.fullName = 'Weavile-GX UNM';
        this.setNumber = '132';
        this.cardImage = 'assets/cardback.png';
    }
    reduceEffect(store, state, effect) {
        // Shadow Connection
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const generator = useShadowConnection(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        // Nocturnal Maneuvers-GX
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            if (player.usedGX) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_GX_USED);
            }
            player.usedGX = true;
            let missingBenched = 0;
            player.bench.forEach(benchedSpot => {
                if (benchedSpot.cards.length === 0) {
                    missingBenched++;
                }
            });
            let cards = [];
            const slots = player.bench.filter(b => b.cards.length === 0);
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.deck, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC }, { min: 0, max: missingBenched, allowCancel: false }), selected => {
                cards = selected || [];
                cards.forEach((card, index) => {
                    player.deck.moveCardTo(card, slots[index]);
                    slots[index].pokemonPlayedTurn = state.turn;
                });
                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            });
        }
        return state;
    }
}
exports.WeavileGX = WeavileGX;
