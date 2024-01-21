"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IronCrownex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class IronCrownex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.FUTURE];
        this.regulationMark = 'H';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 220;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Cobalt Command',
                powerType: game_1.PowerType.ABILITY,
                text: 'Your Future Pokémon\'s attacks, except any Iron Crown ex, do 20 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).'
            }];
        this.attacks = [
            {
                name: 'Twin Shotels',
                cost: [],
                damage: 0,
                text: 'This attack does 50 damage to 2 of your opponent\'s Pokémon. This attack\'s damage isn\'t affected by Weakness or Resistance, or by any effects on those Pokémon.'
            }
        ];
        this.set = 'SV5';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '036';
        this.name = 'Iron Crown ex';
        this.fullName = 'Iron Crown ex';
    }
    reduceEffect(store, state, effect) {
        // if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
        //   const player = effect.player;
        //   const futurePokemon = player.active.getPokemonCard();
        //   if (futurePokemon && futurePokemon.tags.includes(CardTag.FUTURE)) {
        //     if (effect instanceof DealDamageEffect) {
        //       // exclude Iron Crown ex
        //       if (effect.card.name !== 'Iron Crown ex') {
        //         effect.damage += 10;
        //       }
        //     }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const max = Math.min(2);
            state = store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: max, allowCancel: false }), selected => {
                const targets = selected || [];
                targets.forEach(target => {
                    effect.ignoreWeakness = true;
                    effect.ignoreResistance = true;
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, 50);
                    damageEffect.preventDefault = false;
                    damageEffect.target = target;
                    state = store.reduceEffect(state, damageEffect);
                });
                return state;
            });
        }
        return state;
    }
}
exports.IronCrownex = IronCrownex;
