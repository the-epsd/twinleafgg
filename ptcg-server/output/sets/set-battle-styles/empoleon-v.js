"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmpoleonV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_message_1 = require("../../game/game-message");
class EmpoleonV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_V, card_types_1.CardTag.RAPID_STRIKE];
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'E';
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 210;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Emperor\'s Eyes',
                powerType: game_1.PowerType.ABILITY,
                text: 'As long as this Pokémon is your Active Pokémon, each Pokémon in ' +
                    'play, in each player\'s hand, and in each player\'s discard pile has ' +
                    'no Abilities (except for P Pokémon).'
            }];
        this.attacks = [
            {
                name: 'Swirling Slice',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 130,
                text: 'Move an Energy from this Pokémon to 1 of your Benched Pokémon.'
            },
        ];
        this.set = 'BST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '40';
        this.name = 'Empoleon V';
        this.fullName = 'Empoleon V BST';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const hasBench = player.bench.some(b => b.cards.length > 0);
            if (hasBench === false) {
                return state;
            }
            return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_message_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.active, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: 1, max: 1 }), transfers => {
                transfers = transfers || [];
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.active.moveCardTo(transfer.card, target);
                }
            });
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power.powerType === game_1.PowerType.ABILITY) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Empoleon is not active Pokemon
            if (player.active.getPokemonCard() !== this
                && opponent.active.getPokemonCard() !== this) {
                return state;
            }
            const cardList = game_1.StateUtils.findCardList(state, effect.card);
            if (cardList instanceof game_1.PokemonCardList) {
                const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(cardList);
                store.reduceEffect(state, checkPokemonType);
            }
            // We are not blocking the Abilities from Non-Basic Pokemon
            if (effect.card.stage !== card_types_1.Stage.BASIC) {
                return state;
            }
            // We are not blocking the Abilities from Pokemon V, VMAX or VSTAR
            //if (CardTag.POKEMON_V || CardTag.POKEMON_VMAX || CardTag.POKEMON_VSTAR || CardTag.POKEMON_EX || CardTag.POKEMON_GX || CardTag.POKEMON_ex || CardTag.POKEMON_LV_X || CardTag.RADIANT) {
            //  return state;
            //}
            // Try reducing ability for each player  
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: game_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                throw new game_1.GameError(game_message_1.GameMessage.BLOCKED_BY_ABILITY);
            }
            return state;
        }
        return state;
    }
}
exports.EmpoleonV = EmpoleonV;
