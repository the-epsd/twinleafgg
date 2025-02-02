"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Starmie = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
function* useSpaceBeacon(next, store, state, effect) {
    const player = effect.player;
    let cards = [];
    if (player.hand.cards.length === 0) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    let basicEnergies = 0;
    player.discard.cards.forEach(c => {
        if (c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC) {
            basicEnergies += 1;
        }
    });
    if (basicEnergies === 0) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, {}, { min: 1, max: 1, allowCancel: false }), selected => {
        cards = selected || [];
        next();
    });
    // Operation canceled by the user
    if (cards.length === 0) {
        return state;
    }
    let recovered = [];
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { min: 1, max: 2, allowCancel: false }), selected => {
        recovered = selected || [];
        next();
    });
    // Operation canceled by the user
    if (recovered.length === 0) {
        return state;
    }
    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === effect.card) {
            cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
        }
    });
    player.hand.moveCardsTo(cards, player.discard);
    player.discard.moveCardsTo(recovered, player.hand);
    return state;
}
class Starmie extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.name = 'Starmie';
        this.cardImage = 'assets/cardback.png';
        this.set = 'EVO';
        this.evolvesFrom = 'Staryu';
        this.fullName = 'Starmie EVO';
        this.setNumber = '31';
        this.cardType = card_types_1.CardType.WATER;
        this.stage = card_types_1.Stage.STAGE_1;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Space Beacon',
                powerType: pokemon_types_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), you may discard a card from your hand. If you do, put 2 basic Energy cards from your discard pile into your hand. (You can\'t choose a card you discarded with the effect of this Ability.)'
            }];
        this.attacks = [
            {
                name: 'Star Freeze',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
            }
        ];
        this.SPACE_BEACON_MARKER = 'SPACE_BEACON_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.SPACE_BEACON_MARKER, this)) {
            const player = effect.player;
            player.marker.removeMarker(this.SPACE_BEACON_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.marker.hasMarker(this.SPACE_BEACON_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            // Check if DiscardToHandEffect is prevented
            const discardEffect = new play_card_effects_1.DiscardToHandEffect(player, this);
            store.reduceEffect(state, discardEffect);
            if (discardEffect.preventDefault) {
                return state;
            }
            const generator = useSpaceBeacon(() => generator.next(), store, state, effect);
            player.marker.addMarker(this.SPACE_BEACON_MARKER, this);
            return generator.next().value;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === true) {
                    const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.PARALYZED]);
                    store.reduceEffect(state, specialConditionEffect);
                }
            });
        }
        return state;
    }
}
exports.Starmie = Starmie;
