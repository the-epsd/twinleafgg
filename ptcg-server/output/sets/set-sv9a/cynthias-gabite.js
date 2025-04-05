"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CynthiasGabite = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class CynthiasGabite extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Cynthia\'s Gible';
        this.tags = [card_types_1.CardTag.CYNTHIAS];
        this.cardType = F;
        this.hp = 100;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.powers = [
            {
                name: 'Champion\'s Call',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, you may search your deck for a Cynthia\'s Pokémon, reveal it, and put it into your hand. Then, shuffle your deck.'
            }
        ];
        this.attacks = [
            {
                name: 'Dragon Slice',
                cost: [F],
                damage: 40,
                text: ''
            }
        ];
        this.regulationMark = 'I';
        this.set = 'SV9a';
        this.setNumber = '43';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Cynthia\'s Gabite';
        this.fullName = 'Cynthia\'s Gabite SV9a';
        this.CHAMPIONS_CALL_MARKER = 'CHAMPIONS_CALL_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            prefabs_1.REMOVE_MARKER(this.CHAMPIONS_CALL_MARKER, effect.player, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && prefabs_1.HAS_MARKER(this.CHAMPIONS_CALL_MARKER, effect.player, this)) {
            prefabs_1.REMOVE_MARKER(this.CHAMPIONS_CALL_MARKER, effect.player, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (prefabs_1.HAS_MARKER(this.CHAMPIONS_CALL_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            prefabs_1.ABILITY_USED(player, this);
            const blocked = [];
            player.deck.cards.forEach((card, index) => {
                if (card instanceof pokemon_card_1.PokemonCard && !card.tags.includes(card_types_1.CardTag.CYNTHIAS)) {
                    blocked.push(index);
                }
            });
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.POKEMON }, { min: 0, max: 1, allowCancel: false, blocked }), cards => {
                if (cards.length > 0) {
                    prefabs_1.MOVE_CARDS_TO_HAND(store, state, player, cards);
                    prefabs_1.SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
                }
                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                    prefabs_1.ADD_MARKER(this.CHAMPIONS_CALL_MARKER, player, this);
                });
            });
        }
        return state;
    }
}
exports.CynthiasGabite = CynthiasGabite;
