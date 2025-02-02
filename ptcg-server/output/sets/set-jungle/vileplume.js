"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vileplume = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Vileplume extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Gloom';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 80;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Heal',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEMON_POWER,
                text: 'Once during your turn (before your attack), you may flip a coin. If heads, remove 1 damage counter from 1 of your Pokémon. This power can\'t be used if Vileplume is Asleep, Confused, or Paralyzed.'
            }];
        this.attacks = [{
                name: 'Petal Dance',
                cost: [G, G, G],
                damage: 40,
                damageCalculation: 'x',
                text: 'Flip 3 coins. This attack does 40 damage times the number of heads. Vileplume is now Confused (after doing damage).'
            }];
        this.set = 'JU';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '15';
        this.name = 'Vileplume';
        this.fullName = 'Vileplume JU';
        this.HEAL_MARKER = 'HEAL_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            if (cardList.specialConditions.includes(card_types_1.SpecialCondition.ASLEEP) ||
                cardList.specialConditions.includes(card_types_1.SpecialCondition.CONFUSED) ||
                cardList.specialConditions.includes(card_types_1.SpecialCondition.PARALYZED)) {
                return state;
            }
            const blocked = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (cardList.damage === 0) {
                    blocked.push(target);
                }
            });
            const hasPokeBenchWithDamage = player.bench.some(b => b.damage > 0);
            const hasActiveWIthDamage = player.active.damage > 0;
            const pokemonInPlayWithDamage = hasPokeBenchWithDamage || hasActiveWIthDamage;
            if (player.marker.hasMarker(this.HEAL_MARKER)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (!pokemonInPlayWithDamage) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            let targets = [];
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_HEAL, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 0, max: 1, allowCancel: false, blocked }), results => {
                targets = results || [];
                if (targets.length === 0) {
                    return state;
                }
                player.marker.addMarker(this.HEAL_MARKER, this);
                targets.forEach(target => {
                    // Heal Pokemon
                    const healEffect = new game_effects_1.HealEffect(player, target, 10);
                    store.reduceEffect(state, healEffect);
                });
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (cardList.getPokemonCard() === this) {
                        cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                    }
                });
                return state;
            });
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.HEAL_MARKER, this)) {
            effect.player.marker.removeMarker(this.HEAL_MARKER, this);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            state = store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP),
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP),
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], results => {
                let heads = 0;
                results.forEach(r => { heads += r ? 1 : 0; });
                effect.damage = 40 * heads;
            });
            player.active.addSpecialCondition(card_types_1.SpecialCondition.CONFUSED);
            return state;
        }
        return state;
    }
}
exports.Vileplume = Vileplume;
