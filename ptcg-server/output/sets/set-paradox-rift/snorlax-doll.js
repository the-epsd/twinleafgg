"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnorlaxDoll = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class SnorlaxDoll extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = game_1.TrainerType.ITEM;
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.COLORLESS;
        this.cardTypez = game_1.CardType.COLORLESS;
        this.movedToActiveThisTurn = false;
        this.pokemonType = game_1.PokemonType.NORMAL;
        this.evolvesFrom = '';
        this.cardTag = [game_1.CardTag.PLAY_DURING_SETUP];
        this.tools = [];
        this.archetype = [];
        this.hp = 120;
        this.weakness = [];
        this.retreat = [];
        this.resistance = [];
        this.attacks = [];
        this.set = 'PAR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '165';
        this.name = 'Snorlax Doll';
        this.fullName = 'Snorlax Doll SIT';
        this.regulationMark = 'G';
        this.powers = [
            {
                name: 'Snorlax Doll',
                text: `If this card is in your hand when you are setting up to play, you may put it face down in the Active Spot or on your Bench as if it were a 120-HP Basic [C] Pokémon. (You can do this only when you are setting up to play.) At any time during your turn, you may discard this card from play.

This card can't be affected by any Special Conditions and can't retreat. If this card is Knocked Out, your opponent can't take any Prize cards for it.`,
                useWhenInPlay: true,
                exemptFromAbilityLock: true,
                powerType: game_1.PowerType.TRAINER_ABILITY
            }
        ];
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            store.log(state, game_1.GameLog.LOG_PLAYER_DISCARDS_CARD, { name: player.name, card: this.name, effect: 'Snorlax Doll' });
            const cardList = game_1.StateUtils.findCardList(state, this);
            cardList.moveCardTo(this, player.discard);
        }
        if (effect instanceof attack_effects_1.AddSpecialConditionsEffect && effect.target.getPokemonCard() === this) {
            effect.preventDefault = true;
        }
        if (effect instanceof play_card_effects_1.PlayItemEffect && effect.trainerCard === this) {
            throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
        }
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target.getPokemonCard() === this) {
            effect.prizeCount = 0;
            return state;
        }
        if (effect instanceof game_effects_1.RetreatEffect && effect.player.active.cards.includes(this)) {
            throw new game_1.GameError(game_1.GameMessage.CANNOT_RETREAT);
        }
        return state;
    }
}
exports.SnorlaxDoll = SnorlaxDoll;
