"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Polteageist = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Polteageist extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Sinistea';
        this.cardType = P;
        this.hp = 60;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.powers = [
            {
                name: 'Tea Break',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'You must discard a Pokémon that has the Mad Party attack from your hand in order to use this Ability. ' +
                    'Once during your turn, you may draw 2 cards.',
            }
        ];
        this.attacks = [
            {
                name: 'Mad Party',
                cost: [C, C],
                damage: 20,
                damageCalculation: 'x',
                text: 'This attack does 20 damage for each Pokémon in your discard pile that has the Mad Party attack.'
            }
        ];
        this.set = 'DAA';
        this.name = 'Polteageist';
        this.fullName = 'Polteageist DAA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '83';
        this.regulationMark = 'D';
        this.ABILITY_USED_MARKER = 'ABILITY_USED_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.ABILITY_USED_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ABILITY_USED_MARKER, this)) {
            const player = effect.player;
            player.marker.removeMarker(this.ABILITY_USED_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const hasEnergyInHand = player.hand.cards.some(c => {
                return c instanceof game_1.EnergyCard;
            });
            if (!hasEnergyInHand)
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            if (player.marker.hasMarker(this.ABILITY_USED_MARKER, this))
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            if (player.deck.cards.length === 0)
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            const blocked = player.hand.cards
                .filter(c => !c.attacks.some(a => a.name === 'Mad Party'))
                .map(c => player.hand.cards.indexOf(c));
            if (blocked.length == player.hand.cards.length)
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, { superType: card_types_1.SuperType.POKEMON }, { allowCancel: true, min: 1, max: 1, blocked }), cards => {
                cards = cards || [];
                if (cards.length === 0) {
                    return;
                }
                player.marker.addMarker(this.ABILITY_USED_MARKER, this);
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (cardList.getPokemonCard() === this) {
                        cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                    }
                });
                player.hand.moveCardsTo(cards, player.discard);
                player.deck.moveTo(player.hand, 2);
            });
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            let pokemonCount = 0;
            player.discard.cards.forEach(c => {
                if (c instanceof pokemon_card_1.PokemonCard && c.attacks.some(a => a.name === 'Mad Party'))
                    pokemonCount += 1;
            });
            effect.damage = pokemonCount * 20;
        }
        return state;
    }
}
exports.Polteageist = Polteageist;
