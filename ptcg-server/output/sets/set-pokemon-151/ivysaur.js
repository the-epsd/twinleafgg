"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ivysaur = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");

function* useLeechSeed(next, store, state, effect) {
    const player = effect.player;
                const healTargetEffect = new attack_effects_1.HealTargetEffect(effect, 20);
                healTargetEffect.target = player.active;
                state = store.reduceEffect(state, healTargetEffect);
                return state;
            }

class Ivysaur extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 100;
        this.weakness = [{
                type: card_types_1.CardType.FIRE,
            }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Leech Seed',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: 'Heal 20 damage from this Pokémon. '
            },
            {
            name: 'Vine Whip',
            cost: [card_types_1.CardType.GRASS, card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS],
            damage: 80,
            text: ''
        }
    ];
            this.set = '151';
            this.name = 'Ivysaur';
            this.fullName = 'Ivysaur 151 002';

        }
        reduceEffect(store, state, effect) {
            if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
                const generator = useLeechSeed(() => generator.next(), store, state, effect);
                return generator.next().value;
            }
            return state;
        }
    }
    exports.Ivysaur = Ivysaur;
    
    