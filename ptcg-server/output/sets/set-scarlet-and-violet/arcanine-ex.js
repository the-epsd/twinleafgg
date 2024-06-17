"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Arcanineex = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Arcanineex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Growlithe';
        this.tags = [game_1.CardTag.POKEMON_ex, game_1.CardTag.POKEMON_TERA];
        this.cardType = game_1.CardType.FIRE;
        this.hp = 280;
        this.weakness = [{ type: game_1.CardType.WATER }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Raging Claws',
                cost: [game_1.CardType.FIRE, game_1.CardType.FIRE],
                damage: 30,
                damageCalculation: '+',
                text: 'This attack does 10 more damage for each damage counter on this Pokémon.'
            },
            {
                name: 'Bright Flame',
                cost: [game_1.CardType.FIRE, game_1.CardType.FIRE, game_1.CardType.FIRE],
                damage: 250,
                text: 'Discard 2 [R] Energy from this Pokémon.'
            },
        ];
        this.set = 'SVI';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '32';
        this.name = 'Arcanine ex';
        this.fullName = 'Arcanine ex SVI';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            effect.damage = effect.player.active.damage * 10;
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            state = store.prompt(state, new game_1.ChooseEnergyPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, checkProvidedEnergy.energyMap, [game_1.CardType.FIRE, game_1.CardType.FIRE], { allowCancel: false }), energy => {
                const cards = (energy || []).map(e => e.card);
                const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                discardEnergy.target = player.active;
                store.reduceEffect(state, discardEnergy);
            });
        }
        if (effect instanceof attack_effects_1.PutDamageEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Target is not Active
            if (effect.target === player.active || effect.target === opponent.active) {
                return state;
            }
            // Target is this Pokemon
            if (effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
                effect.preventDefault = true;
            }
        }
        return state;
    }
}
exports.Arcanineex = Arcanineex;
