"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SylveonVMAX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class SylveonVMAX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_VMAX, card_types_1.CardTag.RAPID_STRIKE];
        this.stage = card_types_1.Stage.VMAX;
        this.evolvesFrom = 'Sylveon V';
        this.regulationMark = 'E';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 310;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Precious Touch',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 0,
                text: 'Attach an Energy card from your hand to 1 of your Benched Pokémon. If you do, heal 120 damage from that Pokémon.'
            },
            {
                name: 'Max Harmony',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 70,
                text: 'This attack does 30 more damage for each different type of Pokémon on your Bench.'
            }
        ];
        this.set = 'EVS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '75';
        this.name = 'Sylveon VMAX';
        this.fullName = 'Sylveon VMAX EVS';
    }
    reduceEffect(store, state, effect) {
        var _a, _b, _c;
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const hasEnergyInHand = player.hand.cards.some(c => {
                return c instanceof game_1.EnergyCard;
            });
            if (!hasEnergyInHand) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.hand, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: 1, max: 1 }), transfers => {
                transfers = transfers || [];
                // cancelled by user
                if (transfers.length === 0) {
                    return state;
                }
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.deck.moveCardTo(transfer.card, target);
                    const healEffect = new game_effects_1.HealEffect(player, target, 120);
                    store.reduceEffect(state, healEffect);
                }
            });
            if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
                const player = effect.player;
                let damage = 70;
                let types = 0;
                const countedTypes = new Set();
                if (((_b = (_a = player.active) === null || _a === void 0 ? void 0 : _a.getPokemonCard()) === null || _b === void 0 ? void 0 : _b.cardType) !== card_types_1.CardType.PSYCHIC) {
                    countedTypes.add((_c = player.active.getPokemonCard()) === null || _c === void 0 ? void 0 : _c.cardType);
                }
                player.bench.forEach(benchSpot => {
                    const card = benchSpot.getPokemonCard();
                    if ((card === null || card === void 0 ? void 0 : card.cardType) !== card_types_1.CardType.PSYCHIC && !countedTypes.has(card === null || card === void 0 ? void 0 : card.cardType)) {
                        countedTypes.add(card === null || card === void 0 ? void 0 : card.cardType);
                        types++;
                    }
                });
                damage += types * 30;
                effect.damage = damage;
                return state;
            }
            return state;
        }
        return state;
    }
}
exports.SylveonVMAX = SylveonVMAX;
