"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LilliesClefairyex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class LilliesClefairyex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.LILLIES];
        this.regulationMark = 'I';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 190;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Fairy Zone',
                powerType: game_1.PowerType.ABILITY,
                text: 'The weakness of each of your opponent\'s D Pokémon in play is now P. (Apply Weakness as x2.)',
            }];
        this.attacks = [
            {
                name: 'Full Moon Rondo',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS],
                damage: 20,
                damageCalculation: '+',
                text: 'This attack does 20 more damage for each Benched ' +
                    'Pokémon (both yours and your opponent\'s).'
            }
        ];
        this.set = 'SV9';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '33';
        this.name = 'Lillie\'s Clefairy ex';
        this.fullName = 'Lillie\'s Clefairy ex SV9';
        this.DRAGON_VULNERABILITY_MARKER = 'DRAGON_VULNERABILITY_MARKER';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (effect instanceof check_effects_1.CheckPokemonStatsEffect) {
            // const cardList = StateUtils.findCardList(state, this);
            // const owner = StateUtils.findOwner(state, cardList);
            const player = state.players[state.activePlayer];
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const pokemonCard = effect.target;
            let isClefairyexInPlay = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isClefairyexInPlay = true;
                }
            });
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                if (card === this) {
                    isClefairyexInPlay = true;
                }
            });
            if (!isClefairyexInPlay) {
                return state;
            }
            if (isClefairyexInPlay) {
                player.marker.addMarker(this.DRAGON_VULNERABILITY_MARKER, this);
                console.log('marker added');
            }
            if (((_a = pokemonCard.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.cardType) === card_types_1.CardType.DRAGON && player.marker.hasMarker(this.DRAGON_VULNERABILITY_MARKER, this)) {
                effect.weakness.push({ type: card_types_1.CardType.PSYCHIC });
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            //Get number of benched pokemon
            const playerBenched = player.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
            const opponentBenched = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
            const totalBenched = playerBenched + opponentBenched;
            effect.damage = 20 + totalBenched * 20;
        }
        return state;
    }
}
exports.LilliesClefairyex = LilliesClefairyex;
