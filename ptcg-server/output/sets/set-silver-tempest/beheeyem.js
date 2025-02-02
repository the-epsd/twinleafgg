"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Beheeyem = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Beheeyem extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Elgyem';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Psychic Sphere',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 30,
                text: ''
            },
            {
                name: 'Psychic Arrow',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'This attack does 60 damage to 1 of your opponent\'s Pokémon. Also apply Weakness and Resistance for Benched Pokémon.'
            }
        ];
        this.set = 'SIT';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '80';
        this.name = 'Beheeyem';
        this.fullName = 'Beheeyem PAR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), selected => {
                const targets = selected || [];
                targets.forEach(target => {
                    let damage = 60;
                    if (target !== opponent.active) {
                        const pokemonCard = target.getPokemonCard();
                        if (pokemonCard && pokemonCard.weakness) {
                            const weakness = pokemonCard.weakness.find(w => w.type === card_types_1.CardType.PSYCHIC);
                            if (weakness) {
                                damage *= 2; // Apply weakness
                            }
                        }
                    }
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, damage);
                    damageEffect.target = target;
                    store.reduceEffect(state, damageEffect);
                });
            });
        }
        return state;
    }
}
exports.Beheeyem = Beheeyem;
