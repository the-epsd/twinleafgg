"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Venusaurex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");



class Venusaurex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 340;
        this.weakness = [{
                type: card_types_1.CardType.FIRE,
            }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Poison Whip',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS],
                damage: 150,
                text: 'Your opponent\'s Active Pokemon is now Confused and ' +
                'Poisoned.'
        }
    ];
            this.set = '151';
            this.name = 'Venusaur ex';
            this.fullName = 'Venusaur ex 151 003';

        }
        reduceEffect(store, state, effect) {
            if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
                const player = effect.player;
                const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.CONFUSED, card_types_1.SpecialCondition.POISONED]);
                store.reduceEffect(state, specialConditionEffect);
                //player.active.moveTo(player.deck);
                player.active.clearEffects();
                //return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
                    //player.deck.applyOrder(order);
                
            }
            return state;
        }
    }
    exports.Venusaurex = Venusaurex;