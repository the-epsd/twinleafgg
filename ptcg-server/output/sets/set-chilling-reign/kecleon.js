"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kecleon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Kecleon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.RAPID_STRIKE];
        this.cardType = C;
        this.hp = 90;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Chromashift',
                powerType: game_1.PowerType.ABILITY,
                text: 'This Pokémon is the same type as any basic Energy attached to it. (If it has 2 or more different types of basic Energy attached, this Pokémon is each of those types.)'
            }];
        this.attacks = [{
                name: 'Spinning Attack',
                cost: [C, C, C],
                damage: 90,
                text: ''
            }];
        this.set = 'CRE';
        this.name = 'Kecleon';
        this.fullName = 'Kecleon CRE';
        this.setNumber = '122';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckPokemonTypeEffect && effect.target.getPokemonCard() === this) {
            const player = game_1.StateUtils.findOwner(state, effect.target);
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    let energies = new game_1.CardList();
                    energies.cards = cardList.cards.filter(card => card instanceof game_1.EnergyCard && card.energyType === card_types_1.EnergyType.BASIC);
                    if (energies.cards.length === 0) {
                        effect.cardTypes = [C];
                        return state;
                    }
                    effect.cardTypes = [];
                    energies.cards.forEach(energy => {
                        switch (energy.name) {
                            case 'Grass Energy':
                                effect.cardTypes.push(G);
                                break;
                            case 'Water Energy':
                                effect.cardTypes.push(W);
                                break;
                            case 'Fire Energy':
                                effect.cardTypes.push(R);
                                break;
                            case 'Lightning Energy':
                                effect.cardTypes.push(L);
                                break;
                            case 'Psychic Energy':
                                effect.cardTypes.push(P);
                                break;
                            case 'Fighting Energy':
                                effect.cardTypes.push(F);
                                break;
                            case 'Darkness Energy':
                                effect.cardTypes.push(D);
                                break;
                            case 'Metal Energy':
                                effect.cardTypes.push(M);
                                break;
                            case 'Fairy Energy':
                                effect.cardTypes.push(Y);
                                break;
                        }
                        console.log(effect.cardTypes.length);
                    });
                }
            });
        }
        return state;
    }
}
exports.Kecleon = Kecleon;
