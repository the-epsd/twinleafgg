"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hitmonchan = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Hitmonchan extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.name = 'Hitmonchan';
        this.set = 'TEU';
        this.fullName = 'Hitmonchan TEU';
        this.stage = card_types_1.Stage.BASIC;
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '74';
        this.hp = 90;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.hitAndRun = false;
        this.attacks = [
            {
                name: 'Hit and Run',
                cost: [card_types_1.CardType.FIGHTING],
                damage: 30,
                text: 'You may switch this Pokémon with 1 of your Benched Pokémon.'
            },
            {
                name: 'Magnum Punch',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 70,
                text: ''
            }
        ];
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            this.hitAndRun = true;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && this.hitAndRun == true) {
            const player = effect.player;
            const hasBenched = player.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                this.hitAndRun = false;
                return state;
            }
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_SWITCH_POKEMON), wantToUse => {
                if (!wantToUse) {
                    this.hitAndRun = false;
                    return state;
                }
                if (wantToUse) {
                    return state = store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_NEW_ACTIVE_POKEMON, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), selected => {
                        if (!selected || selected.length === 0) {
                            this.hitAndRun = false;
                            return state;
                        }
                        this.hitAndRun = false;
                        const target = selected[0];
                        player.switchPokemon(target);
                    });
                }
                return state;
            });
        }
        return state;
    }
}
exports.Hitmonchan = Hitmonchan;
