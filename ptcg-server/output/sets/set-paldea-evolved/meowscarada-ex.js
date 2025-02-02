"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Meowscaradaex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Meowscaradaex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Floragato';
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 310;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Bouquet Magic',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'You must discard a Basic [G] Energy card from your hand in order to use this Ability. Once during your turn, you may put 3 damage counters on 1 of your opponent\'s Benched Pokémon.'
            }];
        this.attacks = [{
                name: 'Scratching Nails',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 100,
                damageCalculation: '+',
                text: 'If your opponent\'s Active Pokémon already has any damage counters on it, this attack does 120 more damage.'
            }];
        this.regulationMark = 'G';
        this.set = 'PAL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '15';
        this.name = 'Meowscarada ex';
        this.fullName = 'Meowscarada ex PAL';
        this.BOUQUET_MAGIC_MARKER = 'BOUQUET_MAGIC_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.BOUQUET_MAGIC_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.marker.removeMarker(this.BOUQUET_MAGIC_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            if (player.marker.hasMarker(this.BOUQUET_MAGIC_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            const hasBenched = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const hasEnergyInHand = player.hand.cards.some(c => {
                return c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC && c.name === 'Grass Energy';
            });
            if (!hasEnergyInHand) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.BOUQUET_MAGIC_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Grass Energy' }, { allowCancel: false, min: 1, max: 1 }), cards => {
                cards = cards || [];
                if (cards.length === 0) {
                    return;
                }
                player.hand.moveCardsTo(cards, player.discard);
                return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), selected => {
                    const targets = selected || [];
                    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                        if (cardList.getPokemonCard() === this) {
                            cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                        }
                    });
                    targets.forEach(target => {
                        target.damage += 30;
                        player.marker.addMarker(this.BOUQUET_MAGIC_MARKER, this);
                    });
                });
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            if (opponent.active.damage > 0) {
                effect.damage += 120;
            }
        }
        return state;
    }
}
exports.Meowscaradaex = Meowscaradaex;
