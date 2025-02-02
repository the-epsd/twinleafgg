"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeldeoEx = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class KeldeoEx extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_EX];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 170;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Rush In',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), if this Pokemon is ' +
                    'on your Bench, you may switch this Pokemon with your Active Pokemon.'
            }];
        this.attacks = [
            {
                name: 'Secret Sword',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 50,
                text: 'Does 20 more damage for each W Energy attached to this Pokemon.'
            }
        ];
        this.set = 'BCR';
        this.name = 'Keldeo EX';
        this.fullName = 'Keldeo EX BCR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '49';
        this.RUSH_IN_MARKER = 'RUSH_IN_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.RUSH_IN_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            let bench;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (card === this && target.slot === game_1.SlotType.BENCH) {
                    bench = cardList;
                }
            });
            if (bench === undefined) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.RUSH_IN_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            player.marker.addMarker(this.RUSH_IN_MARKER, this);
            player.switchPokemon(bench);
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            let energyCount = 0;
            checkProvidedEnergyEffect.energyMap.forEach(em => {
                energyCount += em.provides.filter(cardType => {
                    return cardType === card_types_1.CardType.WATER || cardType === card_types_1.CardType.ANY;
                }).length;
            });
            effect.damage += energyCount * 20;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.RUSH_IN_MARKER, this)) {
            effect.player.marker.removeMarker(this.RUSH_IN_MARKER, this);
        }
        return state;
    }
}
exports.KeldeoEx = KeldeoEx;
