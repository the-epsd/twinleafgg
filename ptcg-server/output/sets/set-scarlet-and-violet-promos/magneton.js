"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Magneton = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Magneton extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Magnemite';
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 100;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Overvolt Discharge',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, you may attach up to 3 Basic Energy cards from your discard pile to your L Pokémon in any way you like. If you use this Ability, this Pokémon is Knocked Out.'
            }];
        this.attacks = [
            {
                name: 'Electric Ball',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS],
                damage: 40,
                text: ''
            }
        ];
        this.set = 'SVP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '159';
        this.name = 'Magneton';
        this.fullName = 'Magneton SVP';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const hasEnergyInHand = player.discard.cards.some(c => {
                return c instanceof game_1.EnergyCard && c.energyType == card_types_1.EnergyType.BASIC;
            });
            if (!hasEnergyInHand) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const blocked2 = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
                if (card.cardType !== card_types_1.CardType.LIGHTNING) {
                    blocked2.push(target);
                }
            });
            return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: false, min: 0, max: 3, blockedTo: blocked2 }), transfers => {
                transfers = transfers || [];
                // cancelled by user
                if (transfers.length === 0) {
                    return state;
                }
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.discard.moveCardTo(transfer.card, target);
                }
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (cardList.getPokemonCard() === this) {
                        cardList.damage += 999;
                    }
                });
            });
        }
        return state;
    }
}
exports.Magneton = Magneton;
