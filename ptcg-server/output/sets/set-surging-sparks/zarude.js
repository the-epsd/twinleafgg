"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zarude = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Zarude extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Leaf Drain',
                cost: [card_types_1.CardType.GRASS],
                damage: 20,
                text: 'Heal 20 damage from this Pokémon.'
            },
            {
                name: 'Jungle Whip',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS],
                damage: 80,
                text: 'You may put all Energy attached to this Pokémon into your hand to have this attack do 80 more damage.'
            }
        ];
        this.set = 'SSP';
        this.setNumber = '11';
        this.cardImage = 'assets/cardback.png';
        this.regulationMark = 'H';
        this.name = 'Zarude';
        this.fullName = 'Zarude SSP';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const healingTime = new attack_effects_1.HealTargetEffect(effect, 20);
            healingTime.target = player.active;
            store.reduceEffect(state, healingTime);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, player.active);
                    state = store.reduceEffect(state, checkProvidedEnergy);
                    const cards = [];
                    checkProvidedEnergy.energyMap.forEach(em => {
                        cards.push(em.card);
                    });
                    player.active.moveCardsTo(cards, player.hand);
                    effect.damage += 80;
                }
            });
        }
        return state;
    }
}
exports.Zarude = Zarude;
