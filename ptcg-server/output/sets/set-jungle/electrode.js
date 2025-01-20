"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Electrode = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Electrode extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolevesFrom = 'Voltorb';
        this.cardType = L;
        this.hp = 90;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Tackle',
                cost: [C, C],
                damage: 20,
                text: ''
            },
            {
                name: 'Chain Lightning',
                cost: [L, L, L],
                damage: 20,
                text: 'If the Defending Pokémon isn\'t Colorless, this attack does 10 damage to each Benched Pokémon of the same type as the Defending Pokémon (including your own).'
            },
        ];
        this.set = 'JU';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '2';
        this.name = 'Electrode';
        this.fullName = 'Electrode FO';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const defendingPokemon = opponent.active;
            if (defendingPokemon.cards.length > 0) {
                const defendingCard = defendingPokemon.cards[0];
                const defendingType = defendingCard.cardType;
                if (defendingType !== card_types_1.CardType.COLORLESS) {
                    // Apply damage to all Pokémon of the same type as the defending Pokémon
                    [player, opponent].forEach(p => {
                        p.forEachPokemon(game_1.PlayerType.TOP_PLAYER | game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                            if (cardList !== defendingPokemon && cardList.cards.length > 0) {
                                const card = cardList.cards[0];
                                if (card.cardType === defendingType) {
                                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, 10);
                                    damageEffect.target = cardList;
                                    state = store.reduceEffect(state, damageEffect);
                                }
                            }
                        });
                    });
                }
            }
        }
        return state;
    }
}
exports.Electrode = Electrode;
