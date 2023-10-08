"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DarkraiVSTAR = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class DarkraiVSTAR extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_VSTAR];
        this.evolvesFrom = 'Darkrai V';
        this.regulationMark = 'F';
        this.stage = card_types_1.Stage.VSTAR;
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 270;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [
            {
                name: 'Star Abyss',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'During your turn, you may put up to 2 Item cards from your discard pile into your hand. (You can\'t use more than 1 VSTAR Power in a game.)'
            }
        ];
        this.attacks = [
            {
                name: 'Dark Pulse',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: 'This attack does 30 more damage for each [D] Energy attached to all of your Pokémon.'
            }
        ];
        this.set = 'ASR';
        this.name = 'Darkrai VSTAR';
        this.fullName = 'Darkrai VSTAR ASR';
        this.VSTAR_MARKER = 'VSTAR_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.VSTAR_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.marker.hasMarker(this.VSTAR_MARKER)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            const hasItem = player.discard.cards.some(c => {
                return c instanceof game_1.TrainerCard && c.trainerType === card_types_1.TrainerType.ITEM;
            });
            if (!hasItem) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            player.marker.addMarker(this.VSTAR_MARKER, this);
            let cards = [];
            return store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.ITEM }, { min: 1, max: 2, allowCancel: true }), selected => {
                cards = selected || [];
                if (cards.length > 0) {
                    player.discard.moveCardsTo(cards, player.hand);
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            let energies = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
                store.reduceEffect(state, checkProvidedEnergyEffect);
                checkProvidedEnergyEffect.energyMap.forEach(energy => {
                    if (energy.provides.includes(card_types_1.CardType.DARK)) {
                        energies += 1;
                    }
                });
            });
            effect.damage = 30 + energies * 30;
        }
        return state;
    }
}
exports.DarkraiVSTAR = DarkraiVSTAR;
