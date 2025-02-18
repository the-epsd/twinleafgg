"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kyurem = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Kyurem extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = N;
        this.hp = 130;
        this.retreat = [C, C];
        this.powers = [{
                name: 'Plasma Bane',
                powerType: game_1.PowerType.ABILITY,
                text: 'If your opponent has any card with Colress in its name in their discard pile, this Pokémon\'s Tri Frost attack can be used for 1 Colorless Energy.'
            }];
        this.attacks = [{
                name: 'Trifrost',
                cost: [W, W, M, M, C],
                damage: 0,
                text: 'Discard all Energy from this Pokémon. This attack does 110 damage to 3 of your opponent\'s Pokémon.'
            }];
        this.regulationMark = 'H';
        this.set = 'SFA';
        this.setNumber = '47';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Kyurem';
        this.fullName = 'Kyurem SFA';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckAttackCostEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: game_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                console.log(effect.cost);
                return state;
            }
            let isColressInOpponentsDiscard = false;
            opponent.discard.cards.filter(card => {
                if (card instanceof game_1.TrainerCard
                    && card.name.includes('Colress')) {
                    isColressInOpponentsDiscard = true;
                }
            });
            if (isColressInOpponentsDiscard) {
                // Remove the Water and Metal energy requirements
                effect.cost = effect.cost.filter(type => type !== card_types_1.CardType.WATER && type !== card_types_1.CardType.METAL);
            }
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            const cards = checkProvidedEnergy.energyMap.map(e => e.card);
            const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
            discardEnergy.target = player.active;
            state = store.reduceEffect(state, discardEnergy);
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 3, allowCancel: false }), selected => {
                const targets = selected || [];
                targets.forEach(target => {
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, 110);
                    damageEffect.target = target;
                    state = store.reduceEffect(state, damageEffect);
                });
                return state;
            });
        }
        return state;
    }
}
exports.Kyurem = Kyurem;
