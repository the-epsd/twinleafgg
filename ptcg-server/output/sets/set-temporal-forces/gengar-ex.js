"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gengarex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Gengarex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.stage = card_types_1.Stage.BASIC;
        this.evolvesFrom = 'Haunter';
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 310;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Gnawing Curse',
                powerType: game_1.PowerType.ABILITY,
                text: 'Whenever your opponent attaches an Energy card from their hand to 1 of their Pokémon, put 2 damage counters on that Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Tricky Steps',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.DARK],
                damage: 160,
                text: 'You may move an Energy from your opponent\'s Active Pokémon to 1 of their Benched Pokémon.'
            }
        ];
        this.set = 'SV5K';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '47';
        this.name = 'Gengar ex';
        this.fullName = 'Gengar ex SV5K';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasBench = opponent.bench.some(b => b.cards.length > 0);
            if (hasBench === false) {
                return state;
            }
            return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, opponent.active, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: 0, max: 1 }), transfers => {
                transfers = transfers || [];
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    opponent.active.moveCardTo(transfer.card, target);
                }
            });
        }
        if (effect instanceof play_card_effects_1.AttachEnergyEffect) {
            const player = effect.player;
            // const opponent = StateUtils.getOpponent(state, player);
            let isGengarInPlay = false;
            if (player.active.cards[0] === this || player.bench.some(b => b.cards[0] === this)) {
                isGengarInPlay = true;
            }
            if (!isGengarInPlay) {
                return state;
            }
            try {
                const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                store.reduceEffect(state, powerEffect);
            }
            catch (_a) {
                return state;
            }
            // const cardList = [opponent.active, ...opponent.bench].filter(b => b.cards.length > 0);
            // if (cardList.length === 0) {
            //   return state;
            // }
            const target = effect.target;
            target.damage += 20;
        }
        return state;
    }
}
exports.Gengarex = Gengarex;
