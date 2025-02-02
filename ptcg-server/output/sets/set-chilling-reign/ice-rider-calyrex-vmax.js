"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IceRiderCalyrexVMAX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class IceRiderCalyrexVMAX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.VMAX;
        this.evolvesFrom = 'Ice Rider Calyrex V';
        this.regulationMark = 'E';
        this.cardType = card_types_1.CardType.WATER;
        this.tags = [card_types_1.CardTag.POKEMON_VMAX];
        this.hp = 320;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Ride of the High King',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 10,
                text: 'This attack does 30 more damage for each of your opponent\'s Benched Pokémon.'
            },
            {
                name: 'Max Lance',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER],
                damage: 10,
                text: 'You may discard up to 2 Energy from this Pokémon. If you do, this attack does 120 more damage for each card you discarded in this way.'
            },
        ];
        this.set = 'CRE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '46';
        this.name = 'Ice Rider Calyrex VMAX';
        this.fullName = 'Ice Rider Calyrex VMAX CRE';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentBenched = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
            const totalBenched = opponentBenched;
            effect.damage = 10 + totalBenched * 30;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            state = store.prompt(state, new game_1.ChooseEnergyPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, checkProvidedEnergy.energyMap, [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS], { allowCancel: false }), energy => {
                const cards = (energy || []).map(e => e.card);
                const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                discardEnergy.target = player.active;
                effect.damage += 120 * cards.length;
                store.reduceEffect(state, discardEnergy);
            });
        }
        return state;
    }
}
exports.IceRiderCalyrexVMAX = IceRiderCalyrexVMAX;
