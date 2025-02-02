"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cresselia = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Cresselia extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Healing Pirouette',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 0,
                text: 'Heal 20 damage from each of your Pokémon.'
            },
            {
                name: 'Crescent Purge',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.PSYCHIC, card_types_1.CardType.PSYCHIC],
                damage: 80,
                damageCalculation: '+',
                text: 'You may turn of your face-down Prize cards face up. If you do, this attack does 80 more damage. (That Prize card remains face up for the rest of the game.)'
            }
        ];
        this.set = 'SV6a';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '21';
        this.name = 'Cresselia';
        this.fullName = 'Cresselia SV6a';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                const healEffect = new game_effects_1.HealEffect(player, cardList, 20);
                state = store.reduceEffect(state, healEffect);
                return state;
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const prizes = player.prizes.filter(p => p.isSecret);
            const cards = [];
            prizes.forEach(p => { p.cards.forEach(c => cards.push(c)); });
            if (prizes.length > 0) {
                state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                    if (wantToUse) {
                        state = store.prompt(state, new game_1.ChoosePrizePrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON, { count: 1, allowCancel: true }), chosenPrize => {
                            if (chosenPrize === null || chosenPrize.length === 0) {
                                prizes.forEach(p => { p.isSecret = true; });
                            }
                            const prizeCard = chosenPrize[0];
                            prizeCard.isSecret = false;
                            prizeCard.isPublic = true;
                            prizeCard.faceUpPrize = true;
                            effect.damage += 80;
                        });
                    }
                });
            }
        }
        return state;
    }
}
exports.Cresselia = Cresselia;
