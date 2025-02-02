"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnidentifiedFossil = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class UnidentifiedFossil extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = game_1.TrainerType.ITEM;
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.COLORLESS;
        this.cardTypez = game_1.CardType.COLORLESS;
        this.movedToActiveThisTurn = false;
        this.pokemonType = game_1.PokemonType.NORMAL;
        this.evolvesFrom = '';
        this.cardTag = [];
        this.tools = [];
        this.archetype = [];
        this.hp = 60;
        this.weakness = [];
        this.retreat = [];
        this.resistance = [];
        this.attacks = [];
        this.set = 'SIT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '165';
        this.name = 'Unidentified Fossil';
        this.fullName = 'Unidentified Fossil SIT';
        this.regulationMark = 'F';
        this.powers = [
            {
                name: 'Unidentified Fossil',
                text: 'At any time during your turn (before your attack), you may discard this card from play.',
                useWhenInPlay: true,
                exemptFromAbilityLock: true,
                powerType: game_1.PowerType.ABILITY
            }
        ];
        this.text = 'Play this card as if it were a 60-HP [C] Basic Pokémon.' +
            '' +
            'This card can\'t retreat.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            store.log(state, game_1.GameLog.LOG_PLAYER_DISCARDS_CARD, { name: player.name, card: this.name, effect: 'Unidentified Fossil' });
            const cardList = game_1.StateUtils.findCardList(state, this);
            cardList.moveCardTo(this, player.discard);
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
        if (effect instanceof game_effects_1.RetreatEffect && effect.player.active.cards.includes(this)) {
            throw new game_1.GameError(game_1.GameMessage.CANNOT_RETREAT);
        }
        return state;
    }
}
exports.UnidentifiedFossil = UnidentifiedFossil;
