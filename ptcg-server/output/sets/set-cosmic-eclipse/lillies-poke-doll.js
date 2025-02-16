"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LilliesPokeDoll = void 0;
const __1 = require("../..");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class LilliesPokeDoll extends __1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.superType = card_types_1.SuperType.TRAINER;
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.cardTypez = card_types_1.CardType.COLORLESS;
        this.movedToActiveThisTurn = false;
        this.pokemonType = card_types_1.PokemonType.NORMAL;
        this.evolvesFrom = '';
        this.cardTag = [];
        this.tools = [];
        this.archetype = [];
        this.hp = 30;
        this.weakness = [];
        this.retreat = [];
        this.resistance = [];
        this.attacks = [];
        this.attacksThisTurn = 0;
        this.maxAttacksThisTurn = 1;
        this.allowSubsequentAttackChoice = false;
        this.set = 'CEC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '197';
        this.name = 'Lillie\'s Poké Doll';
        this.fullName = 'Lillie\'s Poké Doll CEC';
        this.powers = [
            {
                name: 'Lillie\'s Poké Doll',
                text: 'At any time during your turn (before your attack), if this Pokémon is your Active Pokémon, you may discard all cards from it and put it on the bottom of your deck.',
                useWhenInPlay: true,
                exemptFromAbilityLock: true,
                powerType: __1.PowerType.ABILITY
            }
        ];
        this.text = 'Play this card as if it were a 30-HP [C] Basic Pokémon. At any time during your turn (before your attack), if this Pokémon is your Active Pokémon, you may discard all cards from it and put it on the bottom of your deck.' +
            '' +
            'This card can\'t retreat. If this card is Knocked Out, your opponent can\'t take any Prize cards for it.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0] && effect.player.active.cards.includes(this)) {
            const player = effect.player;
            const pokeDollCardList = __1.StateUtils.findCardList(state, this);
            store.log(state, __1.GameLog.LOG_PLAYER_PUTS_CARD_ON_BOTTOM_OF_DECK, { name: player.name, card: this.name });
            // Move Lillie's Poke Doll to bottom of deck
            state = prefabs_1.MOVE_CARDS(store, state, pokeDollCardList, player.deck, {
                cards: [this],
                toBottom: true
            });
            // Move any attached cards to discard
            state = prefabs_1.MOVE_CARDS(store, state, pokeDollCardList, player.discard, {
                cards: pokeDollCardList.cards.filter(c => c !== this)
            });
        }
        if (effect instanceof play_card_effects_1.PlayItemEffect && effect.trainerCard === this) {
            const player = effect.player;
            const emptySlots = player.bench.filter(b => b.cards.length === 0);
            if (emptySlots.length === 0) {
                throw new __1.GameError(__1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const playPokemonEffect = new play_card_effects_1.PlayPokemonEffect(player, this, emptySlots[0]);
            store.reduceEffect(state, playPokemonEffect);
        }
        if (effect instanceof game_effects_1.RetreatEffect && effect.player.active.cards.includes(this)) {
            throw new __1.GameError(__1.GameMessage.CANNOT_RETREAT);
        }
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target.cards.includes(this)) {
            effect.prizeCount = 0;
            return state;
        }
        if (effect instanceof game_effects_1.RetreatEffect && effect.player.active.cards.includes(this)) {
            throw new __1.GameError(__1.GameMessage.CANNOT_RETREAT);
        }
        return state;
    }
}
exports.LilliesPokeDoll = LilliesPokeDoll;
