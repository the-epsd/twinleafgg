"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Donphan = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_message_1 = require("../../game/game-message");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Donphan extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Phanpy';
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.resistance = [{ type: card_types_1.CardType.LIGHTNING, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Spinning Turn',
                cost: [card_types_1.CardType.FIGHTING],
                damage: 40,
                text: 'Switch this Pokemon with 1 of your Benched Pokemon.'
            }, {
                name: 'Wreck',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 80,
                text: 'If there is any Stadium card in play, this attack does ' +
                    '60 more damage. Discard that Stadium card.'
            },
        ];
        this.set = 'PLS';
        this.name = 'Donphan';
        this.fullName = 'Donphan PLS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '72';
        this.hitAndRun = false;
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
            return state = store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_NEW_ACTIVE_POKEMON, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), selected => {
                if (!selected || selected.length === 0) {
                    this.hitAndRun = false;
                    return state;
                }
                this.hitAndRun = false;
                const target = selected[0];
                player.switchPokemon(target);
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const stadiumCard = game_1.StateUtils.getStadiumCard(state);
            if (stadiumCard !== undefined) {
                effect.damage += 60;
                // Discard Stadium
                const cardList = game_1.StateUtils.findCardList(state, stadiumCard);
                const player = game_1.StateUtils.findOwner(state, cardList);
                cardList.moveTo(player.discard);
            }
        }
        return state;
    }
}
exports.Donphan = Donphan;
