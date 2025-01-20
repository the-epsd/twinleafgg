"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RayquazaVMAX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_message_1 = require("../../game/game-message");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class RayquazaVMAX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_VMAX, card_types_1.CardTag.RAPID_STRIKE];
        this.stage = card_types_1.Stage.VMAX;
        this.evolvesFrom = 'Rayquaza V';
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 320;
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Azure Pulse',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, you may discard your hand and draw 3 cards.'
            }];
        this.attacks = [
            {
                name: 'Max Burst',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.LIGHTNING],
                damage: 20,
                text: 'You may discard any amount of basic [R] Energy or any amount of basic [L] Energy from this Pokémon. This attack does 80 more damage for each card you discarded in this way.'
            }
        ];
        this.set = 'EVS';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '111';
        this.name = 'Rayquaza VMAX';
        this.fullName = 'Rayquaza VMAX EVS';
        this.AZURE_PULSE_MARKER = 'AZURE_PULSE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.AZURE_PULSE_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.marker.hasMarker(this.AZURE_PULSE_MARKER, this)) {
                throw new game_1.GameError(game_message_1.GameMessage.POWER_ALREADY_USED);
            }
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            const cards = player.hand.cards.filter(c => c !== this);
            player.hand.moveCardsTo(cards, player.discard);
            player.deck.moveTo(player.hand, 3);
            player.marker.addMarker(this.AZURE_PULSE_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.AZURE_PULSE_MARKER, this)) {
            const player = effect.player;
            player.marker.removeMarker(this.AZURE_PULSE_MARKER, this);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const options = [
                {
                    message: game_message_1.GameMessage.ALL_FIRE_ENERGIES,
                    action: () => {
                        store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.active, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Fire Energy' }, { min: 1, allowCancel: false }), selected => {
                            const cards = selected || [];
                            if (cards.length > 0) {
                                let totalDiscarded = 0;
                                const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                                discardEnergy.target = player.active;
                                totalDiscarded += discardEnergy.cards.length;
                                effect.damage = (totalDiscarded * 80) + 20;
                                store.reduceEffect(state, discardEnergy);
                            }
                        });
                    }
                },
                {
                    message: game_message_1.GameMessage.ALL_LIGHTNING_ENERGIES,
                    action: () => {
                        store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.active, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Lightning Energy' }, { min: 1, allowCancel: false }), selected => {
                            const cards = selected || [];
                            if (cards.length > 0) {
                                let totalDiscarded = 0;
                                const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                                discardEnergy.target = player.active;
                                totalDiscarded += discardEnergy.cards.length;
                                effect.damage = (totalDiscarded * 80) + 20;
                                store.reduceEffect(state, discardEnergy);
                            }
                        });
                    }
                }
            ];
            return store.prompt(state, new game_1.SelectPrompt(player.id, game_message_1.GameMessage.CHOOSE_OPTION, options.map(opt => opt.message), { allowCancel: false }), choice => {
                const option = options[choice];
                option.action();
            });
        }
        return state;
    }
}
exports.RayquazaVMAX = RayquazaVMAX;
