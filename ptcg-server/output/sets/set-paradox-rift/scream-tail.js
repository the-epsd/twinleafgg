"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreamTail = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class ScreamTail extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.tags = [card_types_1.CardTag.ANCIENT];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Slap',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 30,
                text: ''
            },
            {
                name: 'Roaring Scream',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'This attack does 20 damage to 1 of your opponent\'s Pokémon for each damage counter on this Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }
        ];
        this.set = 'PAR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '86';
        this.name = 'Scream Tail';
        this.fullName = 'Scream Tail PAR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const max = Math.min(1);
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: max, max, allowCancel: false }), selected => {
                const targets = selected || [];
                targets.forEach(target => {
                    const damageCounters = effect.player.active.damage;
                    const damageOutput = damageCounters * 2;
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, damageOutput);
                    damageEffect.target = target;
                    store.reduceEffect(state, damageEffect);
                });
                return state;
            });
        }
        return state;
    }
}
exports.ScreamTail = ScreamTail;
