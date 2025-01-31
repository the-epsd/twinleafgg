"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoivernGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class NoivernGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Noibat';
        this.tags = [card_types_1.CardTag.POKEMON_GX];
        this.cardType = N;
        this.hp = 200;
        this.weakness = [{ type: Y }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Distort',
                cost: [D, C],
                damage: 50,
                text: 'Your opponent can\'t play any Item cards from their hand during their next turn.',
            },
            {
                name: 'Sonic Volume',
                cost: [P, D, C],
                damage: 120,
                text: 'Your opponent can\'t play any Special Energy cards from their hand during their next turn.',
            },
            {
                name: 'Boomburst-GX',
                cost: [P, D, C],
                damage: 0,
                gxAttack: true,
                text: 'This attack does 50 damage to each of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.) (You can\'t use more than 1 GX attack in a game.)'
            }
        ];
        this.set = 'BUS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '99';
        this.name = 'Noivern-GX';
        this.fullName = 'Noivern-GX BUS';
        this.OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER = 'OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER';
        this.OPPONENT_CANNOT_PLAY_SPECIAL_ENERGY_MARKER = 'OPPONENT_CANNOT_PLAY_SPECIAL_ENERGY_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Distort
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.marker.addMarker(this.OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER, this);
        }
        if (effect instanceof play_card_effects_1.PlayItemEffect) {
            const player = effect.player;
            if (player.marker.hasMarker(this.OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER, this)) {
            effect.player.marker.removeMarker(this.OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER, this);
        }
        // Sonic Volume
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.marker.addMarker(this.OPPONENT_CANNOT_PLAY_SPECIAL_ENERGY_MARKER, this);
        }
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.energyCard.energyType === card_types_1.EnergyType.SPECIAL) {
            const player = effect.player;
            if (player.marker.hasMarker(this.OPPONENT_CANNOT_PLAY_SPECIAL_ENERGY_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.OPPONENT_CANNOT_PLAY_SPECIAL_ENERGY_MARKER, this)) {
            effect.player.marker.removeMarker(this.OPPONENT_CANNOT_PLAY_SPECIAL_ENERGY_MARKER, this);
        }
        // Boomburst-GX
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[2]) {
            const player = effect.player;
            const opponent = effect.opponent;
            if (player.usedGX) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_GX_USED);
            }
            player.usedGX = true;
            opponent.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                const damage = new attack_effects_1.PutDamageEffect(effect, 50);
                damage.target = cardList;
                store.reduceEffect(state, damage);
            });
        }
        return state;
    }
}
exports.NoivernGX = NoivernGX;
