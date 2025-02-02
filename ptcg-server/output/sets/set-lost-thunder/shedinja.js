"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shedinja = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_effects_2 = require("../../game/store/effects/game-effects");
function* usePower(next, store, state, self, effect) {
    const player = effect.player;
    const cardList = game_1.StateUtils.findCardList(state, self);
    // check if Shedinja is on player's Bench
    const benchIndex = player.bench.indexOf(cardList);
    if (benchIndex === -1) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
    }
    const pokemonCard = player.bench[benchIndex].getPokemonCard();
    if (pokemonCard !== self) {
        throw new game_1.GameError(game_1.GameMessage.ILLEGAL_ACTION);
    }
    // Check if player has a Pokemon without tool, other than Shedinja
    let hasPokemonWithoutTool = false;
    const blocked = [];
    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (cardList.tool === undefined && card !== self) {
            hasPokemonWithoutTool = true;
        }
        else {
            blocked.push(target);
        }
    });
    if (!hasPokemonWithoutTool) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
    }
    // everything checked, we are ready to attach Shedinja as a tool.
    return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_ATTACH_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: true, blocked }), targets => {
        if (targets && targets.length > 0) {
            // Attach Shedinja as a Pokemon Tool
            player.bench[benchIndex].moveCardTo(pokemonCard, targets[0]);
            targets[0].tool = pokemonCard;
            // Discard other cards
            player.bench[benchIndex].moveTo(player.discard);
            player.bench[benchIndex].clearEffects();
        }
    });
}
class Shedinja extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Nincada';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 40;
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Vessel of Life',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), you may discard all cards attached to this Pokémon and attach it to 1 of your Pokémon as a Pokémon Tool card. When the Pokémon this card is attached to is Knocked Out, your opponent takes 1 fewer Prize card.'
            }];
        this.attacks = [
            {
                name: 'Haunt',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Put 3 damage counters on your opponent\'s Active Pokémon.'
            }
        ];
        this.set = 'LOT';
        this.setNumber = '95';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Shedinja';
        this.fullName = 'Shedinja LOT';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_2.PowerEffect && effect.power === this.powers[0]) {
            const generator = usePower(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target.cards.includes(this) && effect.player.active.tool === this) {
            effect.prizeCount -= 1;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.active.damage += 30;
        }
        return state;
    }
}
exports.Shedinja = Shedinja;
