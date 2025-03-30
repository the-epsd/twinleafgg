"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LilliesClefairyex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class LilliesClefairyex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.LILLIES];
        this.cardType = P;
        this.hp = 190;
        this.weakness = [{ type: M }];
        this.retreat = [C];
        this.powers = [{
                name: 'Fairy Zone',
                powerType: game_1.PowerType.ABILITY,
                text: 'The Weakness of each of your opponent\'s [N] Pokémon in play is now [P]. (Apply Weakness as x2.) ',
            }];
        this.attacks = [
            {
                name: 'Full Moon Rondo',
                cost: [P, C],
                damage: 20,
                damageCalculation: '+',
                text: 'This attack does 20 more damage for each Benched Pokémon (both yours and your opponent\'s).'
            }
        ];
        this.regulationMark = 'I';
        this.set = 'JTG';
        this.setNumber = '56';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Lillie\'s Clefairy ex';
        this.fullName = 'Lillie\'s Clefairy ex JTG';
        this.DRAGON_VULNERABILITY_MARKER = 'DRAGON_VULNERABILITY_MARKER';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (effect instanceof check_effects_1.CheckPokemonStatsEffect) {
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
            if (!prefabs_1.IS_ABILITY_BLOCKED(store, state, player, this)) {
                if (((_a = pokemonCard.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.cardType) === card_types_1.CardType.DRAGON) {
                    effect.weakness.push({ type: card_types_1.CardType.PSYCHIC });
                }
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
