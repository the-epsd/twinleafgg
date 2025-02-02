"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sableye = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Sableye extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 70;
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Excavate',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), you may look at the top card of your deck. You may discard that card. '
            }];
        this.attacks = [{
                name: 'Disable',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 10,
                text: 'Choose 1 of your opponent\'s Active Pokémon\'s attacks. That Pokémon can\'t use that attack during your opponent\'s next turn. '
            }];
        this.set = 'CES';
        this.setNumber = '88';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Sableye';
        this.fullName = 'Sableye CES';
        this.EXCAVATE_MARKER = 'EXCAVATE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.EXCAVATE_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            const deckTop = new game_1.CardList();
            player.deck.moveTo(deckTop, 1);
            player.marker.addMarker(this.EXCAVATE_MARKER, this);
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                }
            });
            return store.prompt(state, new game_1.ShowCardsPrompt(player.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, deckTop.cards), () => {
                state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                    if (wantToUse) {
                        deckTop.moveTo(player.discard);
                    }
                    else {
                        deckTop.moveToTopOfDestination(player.deck);
                    }
                });
                return state;
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const pokemonCard = opponent.active.getPokemonCard();
            if (pokemonCard === undefined || pokemonCard.attacks.length === 0) {
                return state;
            }
            store.prompt(state, new game_1.ChooseAttackPrompt(player.id, game_1.GameMessage.CHOOSE_ATTACK_TO_DISABLE, [pokemonCard], { allowCancel: false }), result => {
                result;
                if (!result) {
                    return state;
                }
                this.DISABLED_ATTACK = result;
                store.log(state, game_1.GameLog.LOG_PLAYER_DISABLES_ATTACK, {
                    name: player.name,
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    attack: this.DISABLED_ATTACK.name
                });
                opponent.active.marker.addMarker(game_1.PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER, this);
                return state;
            });
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.player.active.marker.hasMarker(game_1.PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER, this)) {
            if (effect.attack === this.DISABLED_ATTACK) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.active.marker.hasMarker(game_1.PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER, this)) {
            effect.player.marker.removeMarker(game_1.PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER, this);
            this.DISABLED_ATTACK = undefined;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.EXCAVATE_MARKER, this)) {
            const player = effect.player;
            player.marker.removeMarker(this.EXCAVATE_MARKER, this);
        }
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.EXCAVATE_MARKER, this);
            return state;
        }
        return state;
    }
}
exports.Sableye = Sableye;
