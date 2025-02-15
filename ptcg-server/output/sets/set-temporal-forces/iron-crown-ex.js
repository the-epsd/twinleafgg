"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IronCrownex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
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
                exemptFromInitialize: true,
                text: 'Your Future Pokémon\'s attacks, except any Iron Crown ex, do 20 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).'
            }];
        this.attacks = [
            {
                name: 'Twin Shotels',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'This attack does 50 damage to 2 of your opponent\'s Pokémon. This attack\'s damage isn\'t affected by Weakness or Resistance, or by any effects on those Pokémon.'
            }
        ];
        this.set = 'TEF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '81';
        this.name = 'Iron Crown ex';
        this.fullName = 'Iron Crown ex TEF';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const max = Math.min(2);
            state = store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: max, allowCancel: false }), selected => {
                const targets = selected || [];
                if (targets == null) {
                    return state;
                }
                targets.forEach(target => {
                    effect.ignoreWeakness = true;
                    effect.ignoreResistance = true;
                    const applyWeakness = new attack_effects_1.ApplyWeaknessEffect(effect, 50);
                    store.reduceEffect(state, applyWeakness);
                    const damage = applyWeakness.damage;
                    effect.damage = 0;
                    if (damage > 0) {
                        targets.forEach(target => {
                            target.damage = damage;
                            const afterDamage = new attack_effects_1.AfterDamageEffect(effect, damage);
                            state = store.reduceEffect(state, afterDamage);
                        });
                    }
                });
            });
        }
        if (effect instanceof game_effects_1.AttackEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            const source = effect.source.getPokemonCard();
            if (game_1.StateUtils.isPokemonInPlay(player, this) && source.tags.includes(card_types_1.CardTag.FUTURE) &&
                source.name !== 'Iron Crown ex' && prefabs_1.IS_ABILITY_BLOCKED(store, state, player, this) &&
                effect.target !== opponent.active && effect.damage > 0) {
                effect.damage += 20;
            }
        }
        return state;
    }
}
exports.IronCrownex = IronCrownex;
