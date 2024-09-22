"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RareFossil = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class RareFossil extends game_1.TrainerCard {
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
        this.hp = 70;
        this.weakness = [];
        this.retreat = [];
        this.resistance = [];
        this.attacks = [];
        this.set = 'DAA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '167';
        this.name = 'Rare Fossil';
        this.fullName = 'Rare Fossil DAA';
        this.regulationMark = 'D';
        this.powers = [
            {
                name: 'Rare Fossil',
                text: 'At any time during your turn, you may discard this card from play.',
                useWhenInPlay: true,
                exemptFromAbilityLock: true,
                powerType: game_1.PowerType.ABILITY
            }
        ];
        this.text = 'Play this card as if it were a 70-HP Basic [C] Pokémon. At any time during your turn, you may discard this card from play. This card can\'t be affected by any Special Conditions, and it can\'t retreat.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.AddSpecialConditionsEffect && effect.player.active.cards.includes(this)) {
            effect.preventDefault = true;
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            store.log(state, game_1.GameLog.LOG_PLAYER_DISCARDS_CARD, { name: player.name, card: this.name, effect: 'Rare Fossil' });
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
exports.RareFossil = RareFossil;
