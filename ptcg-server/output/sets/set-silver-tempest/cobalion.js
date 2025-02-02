"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cobalion = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const __1 = require("../..");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Cobalion extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'F';
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.GRASS, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Justified Law',
                powerType: __1.PowerType.ABILITY,
                text: 'Your Basic Pokémon\'s attacks do 30 more damage to your opponent\'s Active D Pokémon (before applying Weakness and Resistance).'
            }];
        this.attacks = [
            {
                name: 'Follow-Up',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: 'Choose up to 2 of your Benched Pokémon. For each of those Pokémon, search your deck for a basic Energy card and attach it to that Pokémon. Then, shuffle your deck.'
            }
        ];
        this.set = 'SIT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '126';
        this.name = 'Cobalion';
        this.fullName = 'Cobalion SIT';
    }
    reduceEffect(store, state, effect) {
        var _a, _b;
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const opponent = __1.StateUtils.getOpponent(state, player);
            if (((_a = player.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.stage) == card_types_1.Stage.BASIC && ((_b = opponent.active.getPokemonCard()) === null || _b === void 0 ? void 0 : _b.cardType) == card_types_1.CardType.DARK) {
                if (effect instanceof attack_effects_1.DealDamageEffect) {
                    effect.damage += 30;
                }
                return state;
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const basicPokemon = player.bench.filter(b => { var _a; return ((_a = b.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.stage) == card_types_1.Stage.BASIC; });
            if (basicPokemon.length === 0) {
                return state;
            }
            return store.prompt(state, new __1.ChooseCardsPrompt(player, __1.GameMessage.CHOOSE_CARD_TO_ATTACH, player.deck, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { min: 1, max: 2, allowCancel: true }), selected => {
                const cards = selected || [];
                for (const card of cards) {
                    player.deck.moveCardTo(card, basicPokemon);
                }
                return store.prompt(state, new __1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            });
        }
        return state;
    }
}
exports.Cobalion = Cobalion;
