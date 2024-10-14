"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnownR = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
function* useHiddenPower(next, store, state, effect) {
    const player = effect.player;
    return store.prompt(state, new game_1.MoveEnergyPrompt(effect.player.id, game_1.GameMessage.MOVE_ENERGY_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: true }), transfers => {
        if (transfers === null) {
            return;
        }
        for (const transfer of transfers) {
            const source = game_1.StateUtils.getTarget(state, player, transfer.from);
            const target = game_1.StateUtils.getTarget(state, player, transfer.to);
            source.moveCardTo(transfer.card, target);
        }
    });
}
class UnownR extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC, value: 10 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Retire',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn, if Unown R is on your Bench, you may ' +
                    'discard Unown R and all cards attached to it. (This doesn\'t count ' +
                    'as a Knocked Out Pokémon.) Then, draw a card.'
            }];
        this.attacks = [
            {
                name: 'Hidden Power',
                cost: [],
                damage: 0,
                text: 'Move any number of basic Energy cards attached to your Pokémon ' +
                    'to your other Pokémon in any way you like.'
            }
        ];
        this.set = 'LA';
        this.name = 'Unown R';
        this.fullName = 'Unown R LA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '77';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            // check if UnownR is on player's Bench
            const benchIndex = player.bench.indexOf(cardList);
            if (benchIndex === -1) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            player.bench[benchIndex].moveTo(player.discard);
            player.bench[benchIndex].clearEffects();
            player.deck.moveTo(player.hand, 1);
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const generator = useHiddenPower(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.UnownR = UnownR;
