"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zoroark = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Zoroark extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Zorua';
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Phantom Transformation',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Once during your turn, you may choose a Stage 1 Pokémon, except any Zoroark, from your discard pile. If you do, discard this Pokémon and all attached cards, and put the chosen Pokémon in its place.'
            }];
        this.attacks = [{
                name: 'Night Daze',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 70,
                text: ''
            }];
        this.regulationMark = 'E';
        this.set = 'EVS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '103';
        this.name = 'Zoroark';
        this.fullName = 'Zoroark EVS';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            if (!effect.player.discard.cards.some(b => b instanceof pokemon_card_1.PokemonCard && b.stage === card_types_1.Stage.STAGE_1 && b.name !== this.name)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const getBenchIndex = (player, card) => {
                for (let i = 0; i < player.bench.length; i++) {
                    const bench = player.bench[i];
                    if (bench.cards.includes(card)) {
                        return i;
                    }
                }
                return -1;
            };
            const index = getBenchIndex(effect.player, this);
            return store.prompt(state, new game_1.ChooseCardsPrompt(effect.player, game_1.GameMessage.CHOOSE_POKEMON_TO_DISCARD, effect.player.discard, { stage: card_types_1.Stage.STAGE_1 }, { min: 1, max: 1 }), selected => {
                if (index >= 0) {
                    effect.player.bench[index].moveCardTo(this, effect.player.discard);
                }
                else {
                    effect.player.active.moveCardTo(this, effect.player.discard);
                }
                const replacement = selected[0];
                if (index >= 0) {
                    effect.player.discard.moveCardTo(replacement, effect.player.bench[index]);
                }
                else {
                    effect.player.discard.moveCardTo(replacement, effect.player.active);
                }
                return state;
            });
        }
        return state;
    }
}
exports.Zoroark = Zoroark;
