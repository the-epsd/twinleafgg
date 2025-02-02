"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Flaaffy = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const attach_energy_prompt_1 = require("../../game/store/prompts/attach-energy-prompt");
class Flaaffy extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.regulationMark = 'E';
        this.evolvesFrom = 'Mareep';
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Dynamotor',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), you may attach a L ' +
                    'Energy card from your discard pile to 1 of your Benched Pokemon.'
            }];
        this.attacks = [
            {
                name: 'Electro Ball',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS],
                damage: 50,
                text: ''
            }
        ];
        this.set = 'EVS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '55';
        this.name = 'Flaaffy';
        this.fullName = 'Flaaffy EVS';
        this.DYNAMOTOR_MARKER = 'DYNAMOTOR_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.DYNAMOTOR_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const hasBench = player.bench.some(b => b.cards.length > 0);
            if (!hasBench) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const hasEnergyInDiscard = player.discard.cards.some(c => {
                return c instanceof game_1.EnergyCard
                    && c.energyType === card_types_1.EnergyType.BASIC
                    && c.provides.includes(card_types_1.CardType.LIGHTNING);
            });
            if (!hasEnergyInDiscard) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.DYNAMOTOR_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            state = store.prompt(state, new attach_energy_prompt_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Lightning Energy' }, { allowCancel: false, min: 1, max: 1 }), transfers => {
                transfers = transfers || [];
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (cardList.getPokemonCard() === this) {
                        cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                    }
                });
                // cancelled by user
                if (transfers.length === 0) {
                    return;
                }
                player.marker.addMarker(this.DYNAMOTOR_MARKER, this);
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.discard.moveCardTo(transfer.card, target);
                }
            });
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.DYNAMOTOR_MARKER, this)) {
            effect.player.marker.removeMarker(this.DYNAMOTOR_MARKER, this);
        }
        return state;
    }
}
exports.Flaaffy = Flaaffy;
