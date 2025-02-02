"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Volcanionex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Volcanionex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 220;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Scorching Steam',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, if this Pokemon is in your Active Spot, you may make your opponent’s Active Pokémon Burned.'
            }];
        this.attacks = [
            {
                name: 'Heat Cyclone',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE, card_types_1.CardType.COLORLESS],
                damage: 160,
                text: 'Move an Energy from this Pokémon to 1 of your Benched Pokémon.'
            }
        ];
        this.set = 'SV9';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '17';
        this.name = 'Volcanion ex';
        this.fullName = 'Volcanion ex SV9';
        this.SCORCHING_STEAM = 'SCORCHING_STEAM';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            effect.player.marker.removeMarker(this.SCORCHING_STEAM, this);
        }
        // Scorching Steam
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.active.getPokemonCard() !== this) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.SCORCHING_STEAM, this)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const specialCondition = new check_effects_1.AddSpecialConditionsPowerEffect(opponent, this, opponent.active, [card_types_1.SpecialCondition.BURNED]);
            store.reduceEffect(state, specialCondition);
            player.marker.addMarker(this.SCORCHING_STEAM, this);
            return store.reduceEffect(state, specialCondition);
        }
        // Heat Cyclone
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const hasBench = player.bench.some(b => b.cards.length > 0);
            if (hasBench === false) {
                return state;
            }
            return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.active, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: 1, max: 1 }), transfers => {
                transfers = transfers || [];
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.active.moveCardTo(transfer.card, target);
                }
            });
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.SCORCHING_STEAM, this);
        }
        return state;
    }
}
exports.Volcanionex = Volcanionex;
