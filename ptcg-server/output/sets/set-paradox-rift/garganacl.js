"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Garganacl = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Garganacl extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Naclstack';
        this.regulationMark = 'G';
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 160;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Energizing Rock Salt',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, you may attach a Basic [F] Energy card from your discard pile to 1 of your Pokemon. If you attached Energy to a Pokemon in this way, heal 30 damage from that Pokemon.'
            }];
        this.attacks = [{
                name: 'Land Crush',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING],
                damage: 140,
                text: ''
            }];
        this.set = 'PAR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '104';
        this.name = 'Garganacl';
        this.fullName = 'Garganacl PAR';
        this.ENERGIZING_ROCK_SALT_MARKER = 'ENERGIZING_ROCK_SALT_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.ENERGIZING_ROCK_SALT_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const hasEnergyInDiscard = player.discard.cards.some(c => {
                return c instanceof game_1.EnergyCard
                    && c.energyType === card_types_1.EnergyType.BASIC
                    && c.provides.includes(card_types_1.CardType.FIGHTING);
            });
            if (!hasEnergyInDiscard) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.ENERGIZING_ROCK_SALT_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Fighting Energy' }, { allowCancel: true, min: 1, max: 1 }), transfers => {
                transfers = transfers || [];
                // cancelled by user
                if (transfers.length === 0) {
                    return;
                }
                player.marker.addMarker(this.ENERGIZING_ROCK_SALT_MARKER, this);
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.discard.moveCardTo(transfer.card, target);
                    const healEffect = new game_effects_1.HealEffect(player, target, 30);
                    state = store.reduceEffect(state, healEffect);
                    return state;
                }
            });
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                }
            });
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.ENERGIZING_ROCK_SALT_MARKER, this);
        }
        return state;
    }
}
exports.Garganacl = Garganacl;
