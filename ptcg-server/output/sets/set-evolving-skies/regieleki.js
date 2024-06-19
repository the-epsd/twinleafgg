"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Regieleki = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Regieleki extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Static Shock',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 20,
                text: ''
            },
            {
                name: 'Teraspark',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS],
                damage: 120,
                text: 'Discard all [L] Energy from this Pokémon. This attack also does 40 damage to 2 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }
        ];
        this.set = 'EVS';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '60';
        this.name = 'Regieleki';
        this.fullName = 'Regieleki EVS';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const benched = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
            const min = Math.min(2, benched);
            const max = Math.min(2, benched);
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { min, max, allowCancel: true }), selected => {
                const targets = selected || [];
                targets.forEach(target => {
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, 40);
                    damageEffect.target = target;
                    store.reduceEffect(state, damageEffect);
                });
                const player = effect.player;
                const cards = player.active.cards.filter(c => c instanceof game_1.EnergyCard);
                const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                discardEnergy.target = player.active;
                store.reduceEffect(state, discardEnergy);
                return state;
            });
        }
        return state;
    }
}
exports.Regieleki = Regieleki;
