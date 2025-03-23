"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamRocketEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
class TeamRocketEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.tags = [card_types_1.CardTag.TEAM_ROCKET];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.regulationMark = 'I';
        this.set = 'SV10';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '98';
        this.name = 'Team Rocket Energy';
        this.fullName = 'Team Rocket Energy SV10';
        this.text = `This card can only be attached to a Team Rocket\'s Pokémon. If this card is attached to anything other than a Team Rocket\'s Pokémon, discard this card.
  
  While this card is attached to a Pokémon, this card provides 2 in any combination of [P] and [D] Energy`;
    }
    reduceEffect(store, state, effect) {
        // Check if the card is attached to a Team Rocket's Pokémon
        if (effect instanceof play_card_effects_1.AttachEnergyEffect) {
            state.players.forEach(player => {
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (!cardList.cards.includes(this)) {
                        return;
                    }
                    const pokemon = cardList;
                    const pokemonCard = pokemon.getPokemonCard();
                    if (pokemonCard && !pokemonCard.tags.includes(card_types_1.CardTag.TEAM_ROCKET)) {
                        cardList.moveCardTo(this, player.discard);
                    }
                });
            });
            return state;
        }
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
            try {
                // Add the base EnergyEffect
                const energyEffect = new play_card_effects_1.EnergyEffect(effect.player, this);
                store.reduceEffect(state, energyEffect);
            }
            catch (_a) {
                return state;
            }
            // This energy provides 2 energy in any combination of Psychic and Darkness
            // We'll provide both types and let the energy checking algorithm pick the best combination
            // The logic in StateUtils.checkEnoughEnergy will handle this appropriately
            effect.energyMap.push({
                card: this,
                provides: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.PSYCHIC, card_types_1.CardType.DARK, card_types_1.CardType.DARK]
            });
        }
        return state;
    }
}
exports.TeamRocketEnergy = TeamRocketEnergy;
