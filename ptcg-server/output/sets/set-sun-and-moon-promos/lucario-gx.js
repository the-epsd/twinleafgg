"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LucarioGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
// SMP Lucario-GX 100 (https://limitlesstcg.com/cards/SMP/100)
class LucarioGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_GX];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Riolu';
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 210;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Aura Strike',
                cost: [card_types_1.CardType.FIGHTING],
                damage: 30,
                text: 'If this Pokémon evolved from Riolu during this turn, this attack does 90 more damage.'
            },
            {
                name: 'Cyclone Kick',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS],
                damage: 130,
                text: ''
            },
            {
                name: 'Cantankerous Beatdown-GX',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: 'This attack does 30 damage for each damage counter on this Pokémon. (You can\'t use more than 1 GX attack in a game.)'
            }
        ];
        this.set = 'SMP';
        this.setNumber = 'SM100';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Lucario-GX';
        this.fullName = 'Lucario-GX FLI';
    }
    reduceEffect(store, state, effect) {
        // Aura Strike
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            if (player.active.pokemonPlayedTurn === state.turn) {
                effect.damage += 90;
            }
        }
        // Cantankerous Beatdown-GX
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[2]) {
            const player = effect.player;
            // Check if player has used GX attack
            if (player.usedGX == true) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_GX_USED);
            }
            // set GX attack as used for game
            player.usedGX = true;
            effect.damage = player.active.damage * 3;
        }
        return state;
    }
}
exports.LucarioGX = LucarioGX;
