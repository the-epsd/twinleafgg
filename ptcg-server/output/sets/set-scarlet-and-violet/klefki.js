"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Klefki = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Klefki extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'G';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Mischievous Lock',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'As long as this Pokémon is in the Active Spot, Basic ' +
                    'Pokémon in play (both yours and your opponent\'s) have no ' +
                    'Abilities, except for Mischievous Lock.'
            }];
        this.attacks = [{
                name: 'Joust',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 10,
                text: 'Before doing damage, discard all Pokémon Tools from your opponent\'s Active Pokémon.'
            }];
        this.set = 'SVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '96';
        this.name = 'Klefki';
        this.fullName = 'Klefki SVI';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power.powerType === pokemon_types_1.PowerType.ABILITY) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Klefki is not active Pokemon
            if (player.active.getPokemonCard() !== this
                && opponent.active.getPokemonCard() !== this) {
                return state;
            }
            const cardList = game_1.StateUtils.findCardList(state, effect.card);
            if (cardList instanceof game_1.PokemonCardList) {
                const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(cardList);
                store.reduceEffect(state, checkPokemonType);
            }
            // We are not blocking the Abilities from Non-Basic Pokemon
            if (effect.card.stage !== card_types_1.Stage.BASIC) {
                return state;
            }
            // const pokemonCard = effect.card;
            // Try reducing ability for each player  
            try {
                const playerPowerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                store.reduceEffect(state, playerPowerEffect);
            }
            catch (_a) {
                // pokemonCard.powers = [ ];
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Discard active Pokemon's tool first
            const activePokemon = opponent.active;
            if (activePokemon.tool) {
                activePokemon.moveCardTo(activePokemon.tool, opponent.discard);
                activePokemon.tool = undefined;
            }
            // Then deal damage
            effect.damage = 30;
            return state;
        }
        return state;
    }
}
exports.Klefki = Klefki;
