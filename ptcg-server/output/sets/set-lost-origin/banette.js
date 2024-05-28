"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Banette = void 0;
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Banette extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Shuppet';
        this.regulationMark = 'F';
        this.cardType = game_1.CardType.PSYCHIC;
        this.hp = 100;
        this.weakness = [{ type: game_1.CardType.DARK }];
        this.resistance = [{ type: game_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Puppet Offering',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, you may put a Supporter card from your discard pile into your hand. If you do, put this Pokémon in the Lost Zone. (Discard all attached cards.)'
            }];
        this.attacks = [
            {
                name: 'Spooky Shot',
                cost: [game_1.CardType.PSYCHIC, game_1.CardType.PSYCHIC],
                damage: 50,
                text: ''
            }
        ];
        this.set = 'LOR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '73';
        this.name = 'Banette';
        this.fullName = 'Banette LOR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    const pokemons = cardList.getPokemons();
                    cardList.moveCardsTo(pokemons, player.lostzone);
                    cardList.moveTo(player.discard);
                    cardList.clearEffects();
                }
            });
        }
        return state;
    }
}
exports.Banette = Banette;
