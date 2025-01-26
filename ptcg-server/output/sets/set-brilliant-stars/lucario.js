"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lucario = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Lucario extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Riolu';
        this.cardType = F;
        this.hp = 120;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Roaring Resolve',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, you may put 2 damage counters on this Pokémon. If you do, search your deck for a [F] Energy card and attach it to this Pokémon. Then, shuffle your deck.'
            }];
        this.attacks = [
            {
                name: 'Aura Sphere Volley',
                cost: [F, F],
                damage: 10,
                damageCalculation: '+',
                text: 'Discard all [F] Energy from this Pokémon. This attack does 60 more damage for each card you discarded in this way.'
            }
        ];
        this.set = 'BRS';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '79';
        this.name = 'Lucario';
        this.fullName = 'Lucario BRS';
        this.ROARING_RESOLVE_MARKER = 'ROARING_RESOLVE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this && cardList.marker.hasMarker(this.ROARING_RESOLVE_MARKER, this)) {
                    cardList.marker.removeMarker(this.ROARING_RESOLVE_MARKER, this);
                }
            });
        }
        // Roaring Resolve Gaming
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    if (cardList.marker.hasMarker(this.ROARING_RESOLVE_MARKER, this)) {
                        throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
                    }
                    cardList.marker.addMarker(this.ROARING_RESOLVE_MARKER, this);
                    cardList.damage += 20;
                    let cards = [];
                    store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Fighting Energy' }, { min: 0, max: 1, allowCancel: false, differentTypes: true }), selected => {
                        cards = selected || [];
                        player.deck.moveCardsTo(cards, cardList);
                    });
                }
            });
        }
        // Aura Sphere Volley
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const fightingEnergy = player.active.cards.filter(card => card instanceof game_1.EnergyCard && card.name === 'Fighting Energy');
            effect.damage += 60 * fightingEnergy.length;
            const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, fightingEnergy);
            discardEnergy.target = player.active;
            store.reduceEffect(state, discardEnergy);
        }
        return state;
    }
}
exports.Lucario = Lucario;
