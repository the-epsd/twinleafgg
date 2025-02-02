"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Beedrill = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Beedrill extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.tags = [card_types_1.CardTag.SINGLE_STRIKE];
        this.evolvesFrom = 'Kakuna';
        this.regulationMark = 'E';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Persist Sting',
                cost: [card_types_1.CardType.GRASS],
                damage: 0,
                text: 'If your opponent\'s Active Pokémon has any Special Energy attached, it is Knocked Out.'
            },
            {
                name: 'Jet Spear',
                cost: [card_types_1.CardType.GRASS],
                damage: 110,
                text: 'Discard an Energy from this Pokémon.'
            }
        ];
        this.set = 'CRE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '3';
        this.name = 'Beedril';
        this.fullName = 'Beedril CRE 3';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const pokemon = player.active;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(opponent, pokemon);
            store.reduceEffect(state, checkEnergy);
            checkEnergy.energyMap.forEach(em => {
                const energyCard = em.card;
                if (energyCard instanceof game_1.EnergyCard && energyCard.energyType === card_types_1.EnergyType.SPECIAL) {
                    const activePokemon = opponent.active.getPokemonCard();
                    if (activePokemon) {
                        activePokemon.hp = 0;
                    }
                }
                if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
                    const player = effect.player;
                    const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
                    state = store.reduceEffect(state, checkProvidedEnergy);
                    return store.prompt(state, new game_1.ChooseEnergyPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, checkProvidedEnergy.energyMap, [card_types_1.CardType.COLORLESS], { allowCancel: false }), energy => {
                        const cards = (energy || []).map(e => e.card);
                        const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                        discardEnergy.target = player.active;
                        store.reduceEffect(state, discardEnergy);
                        return state;
                    });
                }
                return state;
            });
            return state;
        }
        return state;
    }
}
exports.Beedrill = Beedrill;
