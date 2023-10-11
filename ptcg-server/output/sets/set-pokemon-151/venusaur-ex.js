"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Venusaurex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
class Venusaurex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 330;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Tranquil Flower',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, you may move up to 2 damage ' +
                    'counters from 1 of your opponent\'s Pokémon to another of ' +
                    'their Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Dangerous Toxwhip',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS],
                damage: 150,
                text: ''
            }
        ];
        this.set = '151';
        this.set2 = '151';
        this.setNumber = '3';
        this.name = 'Venusaur ex';
        this.fullName = 'Venusaur ex MEW 003';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const blocked = [];
            let hasPokemonWithDamage = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (cardList.damage === 0) {
                    blocked.push(target);
                }
                else {
                    hasPokemonWithDamage = true;
                }
            });
            if (player.active.cards[0] !== this || hasPokemonWithDamage === false) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            // Do not discard the card yet
            effect.preventDefault = true;
            let targets = [];
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_HEAL, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: true, blocked }), results => {
                targets = results || [];
                if (targets.length === 0) {
                    return state;
                }
                targets.forEach(target => {
                    // Heal Pokemon
                    const healEffect = new game_effects_1.HealEffect(player, target, 60);
                    store.reduceEffect(state, healEffect);
                });
                return state;
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = game_1.StateUtils.findOwner(state, effect.target);
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.active.specialConditions.push(card_types_1.SpecialCondition.CONFUSED);
            opponent.active.specialConditions.push(card_types_1.SpecialCondition.POISONED);
        }
        return state;
    }
}
exports.Venusaurex = Venusaurex;
