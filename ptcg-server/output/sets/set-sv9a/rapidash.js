"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rapidash = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Rapidash extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Ponyta';
        this.cardType = R;
        this.hp = 110;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.powers = [{
                name: 'Hurried Gait',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your turn, you may draw a card.'
            }];
        this.attacks = [{ name: 'Fire Mane', cost: [R, C], damage: 60, text: '' }];
        this.set = 'SV9a';
        this.name = 'Rapidash';
        this.fullName = 'Rapidash SV9a';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '14';
        this.HURRIED_GAIT_MARKER = 'HURRIED_GAIT_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Hurried Gait
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            if (prefabs_1.HAS_MARKER(this.HURRIED_GAIT_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            prefabs_1.ABILITY_USED(player, this);
            prefabs_1.DRAW_CARDS(player, 1);
            prefabs_1.ADD_MARKER(this.HURRIED_GAIT_MARKER, player, this);
        }
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.HURRIED_GAIT_MARKER, this);
        return state;
    }
}
exports.Rapidash = Rapidash;
