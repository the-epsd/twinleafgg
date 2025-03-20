"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkuntankG = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_message_1 = require("../../game/game-message");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class SkuntankG extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.tags = [card_types_1.CardTag.POKEMON_SP];
        this.hp = 80;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Poison Structure',
                powerType: game_1.PowerType.POKEPOWER,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), if you have a Stadium card in play, you may use this power. Each Active Pokémon (both yours and your opponent\’s) (excluding Pokémon SP) is now Poisoned. This power can\’t be used if Skuntank is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Smokescreen',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: 'If the Defending Pokémon tries to attack during your opponent\’s next turn, your opponent flips a coin. If tails, that attack does nothing.'
            }];
        this.set = 'PL';
        this.name = 'Skuntank G';
        this.fullName = 'Skuntank G PL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '94';
        this.POISON_STRUCTURE_MARKER = 'POISON_STRUCTURE_MARKER';
        this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER = 'DEFENDING_POKEMON_CANNOT_ATTACK_MARKER';
    }
    reduceEffect(store, state, effect) {
        var _a, _b, _c, _d;
        //Poke-Power
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const stadiumCard = game_1.StateUtils.getStadiumCard(state);
            if (stadiumCard === undefined) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            const cardList = game_1.StateUtils.findCardList(state, stadiumCard);
            const stadiumOwner = game_1.StateUtils.findOwner(state, cardList);
            if (stadiumOwner !== player) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            if (prefabs_1.HAS_MARKER(this.POISON_STRUCTURE_MARKER, player, this)) {
                throw new game_1.GameError(game_message_1.GameMessage.POWER_ALREADY_USED);
            }
            if (player.active.cards[0] === this && player.active.specialConditions.length > 0) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            if (!((_b = (_a = player.active) === null || _a === void 0 ? void 0 : _a.getPokemonCard()) === null || _b === void 0 ? void 0 : _b.tags.includes(card_types_1.CardTag.POKEMON_SP))) {
                prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE(store, state, player, this);
            }
            if (!((_d = (_c = opponent.active) === null || _c === void 0 ? void 0 : _c.getPokemonCard()) === null || _d === void 0 ? void 0 : _d.tags.includes(card_types_1.CardTag.POKEMON_SP))) {
                prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE(store, state, opponent, this);
            }
            prefabs_1.ADD_MARKER(this.POISON_STRUCTURE_MARKER, player, this);
            prefabs_1.ABILITY_USED(player, this);
        }
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            prefabs_1.REMOVE_MARKER(this.POISON_STRUCTURE_MARKER, player, this);
        }
        //Attack
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            prefabs_1.ADD_MARKER(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, opponent.active, this);
        }
        if (effect instanceof game_effects_1.AttackEffect && prefabs_1.HAS_MARKER(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, effect.player.active, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            try {
                const coinFlip = new play_card_effects_1.CoinFlipEffect(player);
                store.reduceEffect(state, coinFlip);
            }
            catch (_e) {
                return state;
            }
            const coinFlipResult = prefabs_1.SIMULATE_COIN_FLIP(store, state, player);
            if (!coinFlipResult) {
                effect.damage = 0;
                store.log(state, game_message_1.GameLog.LOG_ABILITY_BLOCKS_DAMAGE, { name: opponent.name, pokemon: this.name });
            }
        }
        //Marker remover
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            if (prefabs_1.HAS_MARKER(this.POISON_STRUCTURE_MARKER, effect.player, this)) {
                prefabs_1.REMOVE_MARKER(this.POISON_STRUCTURE_MARKER, effect.player, this);
            }
            if (prefabs_1.HAS_MARKER(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, effect.player.active, this)) {
                prefabs_1.REMOVE_MARKER(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, effect.player.active, this);
            }
        }
        return state;
    }
}
exports.SkuntankG = SkuntankG;
