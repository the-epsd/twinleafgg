"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Terapagos = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Terapagos extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.COLORLESS;
        this.hp = 120;
        this.weakness = [{ type: game_1.CardType.FIGHTING }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Prism Charge',
                cost: [game_1.CardType.COLORLESS],
                damage: 0,
                text: 'Search your deck for up to 3 Basic Energy all of different types, and attach them to your Tera Pokémon in any way you like. Then shuffle your deck.'
            },
            {
                name: 'Hard Tackle',
                cost: [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 100,
                text: ''
            }
        ];
        this.regulationMark = 'H';
        this.set = 'SV8';
        this.setNumber = '93';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Terapagos';
        this.fullName = 'Terapagos SV8';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            let teraPokemonInPlay = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card) => {
                if (card.tags.includes(game_1.CardTag.POKEMON_TERA)) {
                    teraPokemonInPlay = true;
                }
            });
            if (!teraPokemonInPlay) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
            }
            const blocked2 = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
                if (!card.tags.includes(game_1.CardTag.POKEMON_TERA)) {
                    blocked2.push(target);
                }
            });
            // return store.prompt(state, new ChoosePokemonPrompt(
            //   player.id,
            //   GameMessage.ATTACH_ENERGY_TO_BENCH,
            //   PlayerType.BOTTOM_PLAYER,
            //   [SlotType.BENCH, SlotType.ACTIVE],
            //   { min: 0, max: 2, blocked: blocked2 }
            // ), chosen => {
            //   chosen.forEach(target => {
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_ACTIVE, player.deck, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: game_1.SuperType.ENERGY, energyType: game_1.EnergyType.BASIC }, { allowCancel: false, min: 0, max: 3, blockedTo: blocked2 }), transfers => {
                transfers = transfers || [];
                if (transfers.length === 0) {
                    return;
                }
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.deck.moveCardTo(transfer.card, target);
                }
                return state;
            });
        }
        return state;
    }
}
exports.Terapagos = Terapagos;
