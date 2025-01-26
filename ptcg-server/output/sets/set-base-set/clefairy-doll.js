"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClefairyDoll = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class ClefairyDoll extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.name = 'Clefairy Doll';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '70';
        this.set = 'BS';
        this.fullName = 'Clefairy Doll BS';
        this.evolvesFrom = '';
        this.cardTag = [];
        this.tools = [];
        this.archetype = [];
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.hp = 10;
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.movedToActiveThisTurn = false;
        this.pokemonType = card_types_1.PokemonType.NORMAL;
        this.weakness = [];
        this.resistance = [];
        this.retreat = [];
        this.attacks = [];
        this.powers = [
            {
                name: 'Clefairy Doll',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                exemptFromAbilityLock: true,
                text: 'At any time during your turn before your attack, you may discard Clefairy Doll.'
            }
        ];
        this.text = 'Play Clefairy Doll as if it were a Basic Pokémon. While in play, Clefairy Doll counts a a Pokémon (instead of a Trainer card). Clefairy Doll has no attacks, can\'t retreat, and can\'t be Asleep, Confused, Paralyzed, or Poisoned. If Clefairy Doll is Knocked Out, it doesn\'t count as a Knocked Out Pokémon.';
    }
    reduceEffect(store, state, effect) {
        // Clefairy Doll can't be affected by special conditions
        if (effect instanceof attack_effects_1.AddSpecialConditionsEffect && effect.player.active.cards.includes(this)) {
            effect.preventDefault = true;
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const cardList = effect.player.active;
            const player = effect.player;
            store.log(state, game_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: effect.player.name, card: this.name });
            if (player.bench.every(b => b.cards.length === 0)) {
                // technical implementation does not matter exactly because this ends the game
                effect.player.active.moveCardsTo(effect.player.active.cards, player.deck);
            }
            else {
                player.switchPokemon(cardList);
                const mysteriousFossilCardList = game_1.StateUtils.findCardList(state, this);
                mysteriousFossilCardList.moveCardsTo(mysteriousFossilCardList.cards.filter(c => c === this), effect.player.discard);
                mysteriousFossilCardList.moveCardsTo(mysteriousFossilCardList.cards.filter(c => c !== this), effect.player.discard);
            }
        }
        if (effect instanceof play_card_effects_1.PlayItemEffect && effect.trainerCard === this) {
            const player = effect.player;
            const emptySlots = player.bench.filter(b => b.cards.length === 0);
            if (emptySlots.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const playPokemonEffect = new play_card_effects_1.PlayPokemonEffect(player, this, emptySlots[0]);
            store.reduceEffect(state, playPokemonEffect);
        }
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target.cards.includes(this)) {
            effect.prizeCount = 0;
            return state;
        }
        if (effect instanceof game_effects_1.RetreatEffect && effect.player.active.cards.includes(this)) {
            throw new game_1.GameError(game_1.GameMessage.CANNOT_RETREAT);
        }
        return state;
    }
}
exports.ClefairyDoll = ClefairyDoll;
