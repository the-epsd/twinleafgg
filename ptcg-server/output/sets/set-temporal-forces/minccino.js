"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Minccino = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
function* useCleaningUp(next, store, state, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    let pokemonsWithTool = 0;
    const blocked = [];
    opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (cardList.tool !== undefined) {
            pokemonsWithTool += 1;
        }
        else {
            blocked.push(target);
        }
    });
    if (pokemonsWithTool === 0) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    const max = Math.min(2, pokemonsWithTool);
    let targets = [];
    yield store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: max, allowCancel: true, blocked }), results => {
        targets = results || [];
        next();
    });
    if (targets.length === 0) {
        return state;
    }
    targets.forEach(target => {
        const owner = game_1.StateUtils.findOwner(state, target);
        if (target.tool !== undefined) {
            target.moveCardTo(target.tool, owner.discard);
            target.tool = undefined;
        }
    });
    return state;
}
class Minccino extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Beat',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 10,
                text: ''
            },
            {
                name: 'Cleaning Up',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Discard up to 2 Pokémon Tools from your opponent\'s Pokémon.'
            }
        ];
        this.set = 'TEF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '136';
        this.name = 'Minccino';
        this.fullName = 'Minccino TEF';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const generator = useCleaningUp(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Minccino = Minccino;
