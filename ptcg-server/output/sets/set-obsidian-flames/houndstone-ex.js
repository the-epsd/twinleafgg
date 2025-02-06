"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Houndstoneex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Houndstoneex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Greavard';
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = P;
        this.hp = 260;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Big Bite',
                cost: [P],
                damage: 30,
                text: 'During your opponent\'s next turn, the Defending Pokémon can\'t retreat.'
            },
            {
                name: 'Last Respects',
                cost: [P, C, C],
                damage: 160,
                damageCalculation: '+',
                text: 'This attack does 10 more damage for each [P] Pokémon in your discard pile.'
            }
        ];
        this.regulationMark = 'G';
        this.set = 'OBF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '102';
        this.name = 'Houndstone ex';
        this.fullName = 'Houndstone ex OBF';
        this.CANT_RETREAT_MARKER = 'CANT_RETREAT_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Big Bite
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.active.marker.addMarker(this.CANT_RETREAT_MARKER, this);
            opponent.marker.addMarker(this.CANT_RETREAT_MARKER, this);
        }
        if (effect instanceof check_effects_1.CheckRetreatCostEffect && effect.player.active.marker.hasMarker(this.CANT_RETREAT_MARKER, this)) {
            throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.CANT_RETREAT_MARKER, this)) {
            effect.player.marker.removeMarker(this.CANT_RETREAT_MARKER, this);
            effect.player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.marker.hasMarker(this.CANT_RETREAT_MARKER, this)) {
                    cardList.marker.removeMarker(this.CANT_RETREAT_MARKER, this);
                }
            });
        }
        // Last Respects
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            let psychicsInDiscard = 0;
            player.discard.cards.forEach(card => { if (card instanceof pokemon_card_1.PokemonCard && card.cardType === P) {
                psychicsInDiscard++;
            } });
            effect.damage += psychicsInDiscard * 10;
        }
        return state;
    }
}
exports.Houndstoneex = Houndstoneex;
