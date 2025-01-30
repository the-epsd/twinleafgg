"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Venusaur = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const move_energy_prompt_1 = require("../../game/store/prompts/move-energy-prompt");
const game_effects_1 = require("../../game/store/effects/game-effects");
const __1 = require("../..");
function* moveEnergy(next, store, state, effect) {
    const player = effect.player;
    let hasBasicEnergy = false;
    let pokemonCount = 0;
    player.forEachPokemon(__1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        pokemonCount += 1;
        const basicEnergyAttached = cardList.cards.some(c => {
            return c instanceof __1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC;
        });
        hasBasicEnergy = hasBasicEnergy || basicEnergyAttached;
    });
    if (!hasBasicEnergy || pokemonCount <= 1) {
        throw new __1.GameError(__1.GameMessage.CANNOT_USE_POWER);
    }
    let transfers = [];
    yield store.prompt(state, new move_energy_prompt_1.MoveEnergyPrompt(player.id, __1.GameMessage.MOVE_ENERGY_CARDS, __1.PlayerType.BOTTOM_PLAYER, [__1.SlotType.ACTIVE, __1.SlotType.BENCH], { cardType: card_types_1.CardType.GRASS }, { min: 1, max: 1, allowCancel: false }), result => {
        transfers = result || [];
        next();
    });
    if (transfers.length === 0) {
        return state;
    }
    transfers.forEach(transfer => {
        const source = __1.StateUtils.getTarget(state, player, transfer.from);
        const target = __1.StateUtils.getTarget(state, player, transfer.to);
        source.moveCardTo(transfer.card, target);
    });
    return state;
}
class Venusaur extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.name = 'Venusaur';
        this.set = 'BS';
        this.fullName = 'Venusaur BS';
        this.stage = card_types_1.Stage.STAGE_2;
        this.cardType = card_types_1.CardType.GRASS;
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '15';
        this.hp = 100;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Energy Trans',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.POKEMON_POWER,
                text: 'As often as you like during your turn (before your attack), you may take 1 [G] Energy card attached to 1 of your Pokémon and attach it to a different one. This power can\'t be used if Venusaur is Asleep, Confused, or Paralyzed.'
            }];
        this.attacks = [{
                name: 'Solarbeam',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.GRASS, card_types_1.CardType.GRASS, card_types_1.CardType.GRASS],
                damage: 60,
                text: ''
            }];
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const cardList = __1.StateUtils.findCardList(state, this);
            if (cardList.specialConditions.includes(card_types_1.SpecialCondition.ASLEEP) ||
                cardList.specialConditions.includes(card_types_1.SpecialCondition.CONFUSED) ||
                cardList.specialConditions.includes(card_types_1.SpecialCondition.PARALYZED)) {
                return state;
            }
            const generator = moveEnergy(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Venusaur = Venusaur;
