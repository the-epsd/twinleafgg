"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlakingV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
class SlakingV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_V];
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 230;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Kinda Lazy',
                powerType: game_1.PowerType.ABILITY,
                text: 'If you have exactly 2, 4, or 6 Prize cards remaining, this Pokémon can\'t attack.'
            }];
        this.attacks = [
            {
                name: 'Heavy Impact',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 260,
                text: ''
            }
        ];
        this.set = 'PGO';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '58';
        this.name = 'Slaking V';
        this.fullName = 'Slaking V LOR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseAttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const prizes = effect.player.getPrizeLeft();
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: game_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            if (prizes === 2 || prizes === 4 || prizes === 6) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
            }
            return state;
        }
        return state;
    }
}
exports.SlakingV = SlakingV;
