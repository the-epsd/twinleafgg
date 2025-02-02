"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VictiniVMAX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class VictiniVMAX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_VMAX];
        this.regulationMark = 'E';
        this.stage = card_types_1.Stage.VMAX;
        this.evolvesFrom = 'Victini V';
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 190;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Spreading Flames',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Attach up to 3 {R} Energy cards from your discard pile to ' +
                    'your Pokémon in any way you like.'
            },
            {
                name: 'Max Victory',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.COLORLESS],
                damage: 100,
                text: 'If your opponent’s Active Pokémon is a Pokémon V, this ' +
                    'attack does 120 more damage.'
            }
        ];
        this.set = 'BST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '22';
        this.name = 'Victini VMAX';
        this.fullName = 'Victini VMAX BST';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Fire Energy' }, { allowCancel: true, min: 0, max: 3 }), transfers => {
                transfers = transfers || [];
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    const energyCard = transfer.card;
                    const attachEnergyEffect = new play_card_effects_1.AttachEnergyEffect(player, energyCard, target);
                    store.reduceEffect(state, attachEnergyEffect);
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const defending = opponent.active.getPokemonCard();
            if (defending && (defending.tags.includes(card_types_1.CardTag.POKEMON_V) ||
                defending.tags.includes(card_types_1.CardTag.POKEMON_VMAX) ||
                defending.tags.includes(card_types_1.CardTag.POKEMON_VSTAR))) {
                effect.damage += 100;
            }
        }
        return state;
    }
}
exports.VictiniVMAX = VictiniVMAX;
