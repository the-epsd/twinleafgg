"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaichuV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_message_1 = require("../../game/game-message");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class RaichuV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'F';
        this.tags = [card_types_1.CardTag.POKEMON_V];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 200;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Fast Charge',
                cost: [card_types_1.CardType.LIGHTNING],
                damage: 0,
                text: 'If you go first, you can use this attack during your first turn. Search your deck for a L Energy card and attach it to this Pokémon. Then, shuffle your deck.'
            },
            {
                name: 'Dynamic Spark',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING],
                damage: 60,
                text: 'You may discard any amount of L Energy from your Pokémon. This attack does 60 damage for each card you discarded in this way.'
            }
        ];
        this.set = 'BRS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '45';
        this.name = 'Raichu V';
        this.fullName = 'Raichu V BRS';
    }
    // Implement power
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 6, allowCancel: false }), targets => {
                targets.forEach(target => {
                    return store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_message_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, target, // Card source is target Pokemon
                    { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Lightning Energy' }, { min: 1, allowCancel: false }), selected => {
                        const cards = selected || [];
                        if (cards.length > 0) {
                            let totalDiscarded = 0;
                            targets.forEach(target => {
                                const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                                discardEnergy.target = target;
                                totalDiscarded += discardEnergy.cards.length;
                                effect.damage = totalDiscarded * 60;
                                store.reduceEffect(state, discardEnergy);
                            });
                            return state;
                        }
                    });
                });
                return state;
            });
        }
        return state;
    }
}
exports.RaichuV = RaichuV;
