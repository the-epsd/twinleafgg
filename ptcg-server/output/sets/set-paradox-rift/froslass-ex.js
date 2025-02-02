"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Froslassex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Froslassex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.regulationMark = 'G';
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.evolvesFrom = 'Snorunt';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 250;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Evanescent',
                powerType: game_1.PowerType.ABILITY,
                text: 'If this Pokémon in the Active Spot and is Knocked Out, flip a coin. If heads, your opponent takes 1 fewer Prize card.'
            }
        ];
        this.attacks = [{
                name: 'Frost Bullet',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER],
                damage: 140,
                text: 'This attack does 20 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }
        ];
        this.set = 'PAR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '3';
        this.name = 'Froslass ex';
        this.fullName = 'Froslass ex PAR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target.cards.includes(this)) {
            return store.prompt(state, new game_1.CoinFlipPrompt(effect.player.id, game_1.GameMessage.COIN_FLIP), result => {
                if (result) {
                    // Reduce prizes by 1
                    effect.prizeCount -= 1;
                }
                return state;
            });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const targets = opponent.bench.filter(b => b.cards.length > 0);
            if (targets.length === 0) {
                return state;
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH]), selected => {
                const target = selected[0];
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 20);
                damageEffect.target = target;
                store.reduceEffect(state, damageEffect);
            });
        }
        return state;
    }
}
exports.Froslassex = Froslassex;
