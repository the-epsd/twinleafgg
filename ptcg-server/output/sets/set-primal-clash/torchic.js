"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Torchic = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Torchic extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 50;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Barrage',
                powerType: pokemon_types_1.PowerType.ANCIENT_TRAIT,
                barrage: true,
                text: 'This Pokémon may attack twice a turn. (If the first attack Knocks Out your opponent\'s Active Pokémon, you may attack again after your opponent chooses a new Active Pokémon.)'
            }];
        this.attacks = [{
                name: 'Flare Bonus',
                cost: [card_types_1.CardType.FIRE],
                damage: 0,
                text: ' Discard a [R] Energy card from your hand. If you do, draw 2 cards. '
            },
            {
                name: 'Claw',
                cost: [card_types_1.CardType.FIRE],
                damage: 20,
                text: ' Flip a coin. If tails, this attack does nothing. '
            }];
        this.set = 'PRC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '26';
        this.name = 'Torchic';
        this.fullName = 'Torchic PRC';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect) {
            this.maxAttacksThisTurn = 2;
            this.allowSubsequentAttackChoice = true;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            //DO ATTACK
            let hasCardsInHand = false;
            const blocked = [];
            player.hand.cards.forEach((c, index) => {
                if (c instanceof game_1.EnergyCard) {
                    if (c.provides.includes(card_types_1.CardType.FIRE)) {
                        hasCardsInHand = true;
                    }
                    else {
                        blocked.push(index);
                    }
                }
            });
            if (hasCardsInHand === false) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, { superType: card_types_1.SuperType.ENERGY }, { allowCancel: true, min: 1, max: 1, blocked }), selected => {
                selected = selected || [];
                if (selected.length === 0) {
                    return;
                }
                player.hand.moveCardsTo(selected, player.discard);
                player.deck.moveTo(player.hand, 2);
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            // DO ATTACK
            state = store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === false) {
                    effect.damage = 0;
                }
            });
        }
        return state;
    }
}
exports.Torchic = Torchic;
