"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Charizard = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Charizard extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.set = 'PGO';
        this.setNumber = '53';
        this.cardImage = 'assets/cardback.png';
        this.fullName = 'Charizard PGO';
        this.name = 'Charizard';
        this.cardType = card_types_1.CardType.FIRE;
        this.evolvesFrom = 'Charmeleon';
        this.stage = card_types_1.Stage.STAGE_2;
        this.hp = 170;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.resistance = [];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [
            {
                name: 'Burn Brightly',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Each basic [R] Energy attached to your Pokémon provides [R][R] Energy. You can\'t apply more than 1 Burn Brightly Ability at a time.'
            }
        ];
        this.attacks = [
            {
                name: 'Flare Blitz',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 170,
                text: 'Discard all [R] Energy from this Pokémon.'
            }
        ];
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            [...player.bench, player.active].forEach(cardList => {
                cardList.cards.forEach(c => {
                    if (c.superType === card_types_1.SuperType.ENERGY) {
                        const energyCard = c;
                        if (energyCard.energyType === card_types_1.EnergyType.BASIC && energyCard.provides.includes(card_types_1.CardType.FIRE)) {
                            energyCard.provides.push(...energyCard.provides);
                        }
                    }
                });
            });
        }
        return state;
    }
}
exports.Charizard = Charizard;
