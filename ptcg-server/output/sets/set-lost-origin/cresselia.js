"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cresselia = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Cresselia extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Moonglow Reverse',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 0,
                text: 'Move 2 damage counters from each of your Pokémon to 1 of your opponent\'s Pokémon.'
            },
            {
                name: 'Lunar Blast',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS],
                damage: 110,
                text: ''
            }
        ];
        this.set = 'LOR';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '74';
        this.name = 'Cresselia';
        this.fullName = 'Cresselia LOR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const targets = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                const hasEnergy = cardList.cards.some(c => c instanceof game_1.EnergyCard);
                if (hasEnergy && cardList.damage > 0) {
                    targets.push(cardList);
                }
            });
            let totalHealed = 0;
            targets.forEach(target => {
                totalHealed++;
                const healEffect = new attack_effects_1.HealTargetEffect(effect, 20);
                healEffect.target = target;
                store.reduceEffect(state, healEffect);
            });
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { min: 1, max: 1, allowCancel: false }), selected => {
                const targets = selected || [];
                targets.forEach(target => {
                    target.damage = totalHealed * 20;
                    const putCountersEffect = new attack_effects_1.PutCountersEffect(effect, target.damage);
                    putCountersEffect.target = target;
                    store.reduceEffect(state, putCountersEffect);
                });
                return state;
            });
        }
        return state;
    }
}
exports.Cresselia = Cresselia;
