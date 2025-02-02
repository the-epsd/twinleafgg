"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DelphoxV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class DelphoxV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_V];
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 210;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Eerie Glow',
                cost: [card_types_1.CardType.FIRE],
                damage: 0,
                text: 'Your opponent\'s Active Pokémon is now Burned and Confused.'
            },
            {
                name: 'Magical Fire',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE, card_types_1.CardType.COLORLESS],
                damage: 120,
                text: 'Put 2 Energy attached to this Pokémon in the Lost Zone. This attack also does 120 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }
        ];
        this.set = 'LOR';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '27';
        this.name = 'Delphox V';
        this.fullName = 'Delphox V LOR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const active = opponent.active;
            active.addSpecialCondition(card_types_1.SpecialCondition.BURNED);
            active.addSpecialCondition(card_types_1.SpecialCondition.CONFUSED);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            return store.prompt(state, new game_1.ChooseEnergyPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, checkProvidedEnergy.energyMap, [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS], { allowCancel: false }), energy => {
                const cards = (energy || []).map(e => e.card);
                const lostZoneEnergy = new attack_effects_1.LostZoneCardsEffect(effect, cards);
                lostZoneEnergy.target = player.active;
                store.reduceEffect(state, lostZoneEnergy);
                const hasBenched = opponent.bench.some(b => b.cards.length > 0);
                if (!hasBenched) {
                    return state;
                }
                // Prompt to choose benched pokemon
                const max = Math.min(1);
                return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { min: max, max, allowCancel: false }), selected => {
                    const targets = selected || [];
                    targets.forEach(target => {
                        const damageEffect = new attack_effects_1.PutDamageEffect(effect, 120);
                        damageEffect.target = target;
                        store.reduceEffect(state, damageEffect);
                    });
                    return state;
                });
            });
        }
        return state;
    }
}
exports.DelphoxV = DelphoxV;
