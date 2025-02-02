"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Starmie = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Starmie extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Staryu';
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Mysterious Comet',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: ' Once during your turn, you may put 2 damage counters on 1 of your opponent\'s Pokémon. If you placed any damage counters in this way, discard this Pokémon and all attached cards.'
            }];
        this.attacks = [{
                name: 'Speed Attack',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS],
                damage: 50,
                text: ''
            }];
        this.set = 'MEW';
        this.regulationMark = 'G';
        this.setNumber = '121';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Starmie';
        this.fullName = 'Starmie MEW';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            state = store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), selected => {
                const targets = selected || [];
                targets.forEach(target => {
                    target.damage += 20;
                });
            });
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    cardList.moveTo(player.discard);
                    cardList.clearEffects();
                }
            });
            return state;
        }
        return state;
    }
}
exports.Starmie = Starmie;
