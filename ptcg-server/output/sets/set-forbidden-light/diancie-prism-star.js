"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DianciePS = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class DianciePS extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.PRISM_STAR];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Princess\'s Cheers',
                useWhenInPlay: false,
                powerType: game_1.PowerType.ABILITY,
                text: 'As long as this Pokémon is on your Bench, your [F] Pokémon\'s attacks do 20 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).'
            }];
        this.attacks = [
            {
                name: 'Diamond Rain',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING],
                damage: 90,
                text: 'Heal 30 damage from each of your Benched Pokémon.'
            }
        ];
        this.set = 'FLI';
        this.setNumber = '74';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Diancie Prism Star';
        this.fullName = 'Diancie Prism Star FLI';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.DealDamageEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // we love ability lock so much
            try {
                const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                store.reduceEffect(state, powerEffect);
            }
            catch (_a) {
                return state;
            }
            // checking if this pokemon is in the active
            if (player.active.getPokemonCard() === this) {
                return state;
            }
            // checking if this pokemon is in play
            let isThisInPlay = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isThisInPlay = true;
                }
            });
            if (!isThisInPlay) {
                return state;
            }
            const oppActive = opponent.active.getPokemonCard();
            const damageSource = effect.source.getPokemonCard();
            if (damageSource && damageSource.cardType === card_types_1.CardType.FIGHTING && damageSource !== oppActive) {
                effect.damage += 20;
                return state;
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                if (cardList !== player.active) {
                    const healTargetEffect = new attack_effects_1.HealTargetEffect(effect, 30);
                    healTargetEffect.target = cardList;
                    state = store.reduceEffect(state, healTargetEffect);
                }
            });
        }
        return state;
    }
}
exports.DianciePS = DianciePS;
