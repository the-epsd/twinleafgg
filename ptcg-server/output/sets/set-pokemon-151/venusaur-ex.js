"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Venusaurex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Venusaurex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Ivysaur';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 340;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Tranquil Flower',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, if this Pokémon is in the Active Spot, you may heal 60 damage from 1 of your Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Dangerous Toxwhip',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS],
                damage: 150,
                text: 'Your opponent\'s Active Pokémon is now Confused and Poisoned.'
            }
        ];
        this.set = 'MEW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '3';
        this.name = 'Venusaur ex';
        this.fullName = 'Venusaur ex MEW';
        this.TRANQUIL_FLOWER_MARKER = 'TRANQUIL_FLOWER_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.TRANQUIL_FLOWER_MARKER)) {
            const player = effect.player;
            player.marker.removeMarker(this.TRANQUIL_FLOWER_MARKER);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const blocked = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (cardList.damage === 0) {
                    blocked.push(target);
                }
            });
            const hasPokeBenchWithDamage = player.bench.some(b => b.damage > 0);
            const hasActiveWIthDamage = player.active.damage > 0;
            const pokemonInPlayWithDamage = hasPokeBenchWithDamage || hasActiveWIthDamage;
            if (player.marker.hasMarker(this.TRANQUIL_FLOWER_MARKER)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.active.cards[0] !== this || !pokemonInPlayWithDamage) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            let targets = [];
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_HEAL, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 0, max: 1, allowCancel: false, blocked }), results => {
                targets = results || [];
                if (targets.length === 0) {
                    return state;
                }
                player.marker.addMarker(this.TRANQUIL_FLOWER_MARKER, this);
                targets.forEach(target => {
                    // Heal Pokemon
                    const healEffect = new game_effects_1.HealEffect(player, target, 60);
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
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const active = opponent.active;
            active.addSpecialCondition(card_types_1.SpecialCondition.POISONED);
            active.addSpecialCondition(card_types_1.SpecialCondition.CONFUSED);
        }
        return state;
    }
}
exports.Venusaurex = Venusaurex;
