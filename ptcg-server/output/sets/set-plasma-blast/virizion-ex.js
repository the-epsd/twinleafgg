"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VirizionEx = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
function* useEmeraldSlash(next, store, state, effect) {
    const player = effect.player;
    if (player.deck.cards.length === 0) {
        return state;
    }
    const hasBenched = player.bench.some(b => b.cards.length > 0);
    if (!hasBenched) {
        return state;
    }
    let cards = [];
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.ENERGY, name: 'Grass Energy' }, { min: 1, max: 2, allowCancel: true }), selected => {
        cards = selected || [];
        next();
    });
    if (cards.length > 0) {
        yield store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_ATTACH_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: true }), targets => {
            if (!targets || targets.length === 0) {
                return;
            }
            const target = targets[0];
            player.deck.moveCardsTo(cards, target);
            next();
        });
    }
    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class VirizionEx extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_EX];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 170;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.WATER, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Verdant Wind',
                powerType: game_1.PowerType.ABILITY,
                text: 'Each of your Pokemon that has any G Energy attached to it can\'t ' +
                    'be affected by any Special Conditions. (Remove any Special Conditions ' +
                    'affecting those Pokemon.)'
            }];
        this.attacks = [
            {
                name: 'Emerald Slash',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS],
                damage: 50,
                text: 'You may search your deck for 2 G Energy cards and attach them ' +
                    'to 1 of your Benched Pokemon. Shuffle your deck afterward.'
            }
        ];
        this.set = 'PLB';
        this.name = 'Virizion EX';
        this.fullName = 'Virizion EX PLB';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '9';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const generator = useEmeraldSlash(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        if (effect instanceof check_effects_1.CheckTableStateEffect) {
            state.players.forEach(player => {
                if (player.active.specialConditions.length === 0) {
                    return;
                }
                let hasVirizionInPlay = false;
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                    if (card === this) {
                        hasVirizionInPlay = true;
                    }
                });
                if (!hasVirizionInPlay) {
                    return state;
                }
                const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player);
                store.reduceEffect(state, checkProvidedEnergyEffect);
                const energyMap = checkProvidedEnergyEffect.energyMap;
                const hasGrassEnergy = game_1.StateUtils.checkEnoughEnergy(energyMap, [card_types_1.CardType.GRASS]);
                if (hasGrassEnergy) {
                    // Try to reduce PowerEffect, to check if something is blocking our ability
                    try {
                        const stub = new game_effects_1.PowerEffect(player, {
                            name: 'test',
                            powerType: game_1.PowerType.ABILITY,
                            text: ''
                        }, this);
                        store.reduceEffect(state, stub);
                    }
                    catch (_a) {
                        return state;
                    }
                    const conditions = player.active.specialConditions.slice();
                    conditions.forEach(condition => {
                        player.active.removeSpecialCondition(condition);
                    });
                }
            });
        }
        return state;
    }
}
exports.VirizionEx = VirizionEx;
