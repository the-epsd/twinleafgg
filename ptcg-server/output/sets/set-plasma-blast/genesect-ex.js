"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenesectEX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class GenesectEX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_EX, card_types_1.CardTag.TEAM_PLASMA];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 170;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.powers = [{
                name: 'Red Signal',
                powerType: game_1.PowerType.ABILITY,
                text: 'When you attach a Plasma Energy from your hand to this Pokémon, you may switch 1 of your opponent\'s Benched Pokémon with his or her Active Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Megalo Cannon',
                cost: [G, G, C],
                damage: 100,
                text: 'Does 20 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }
        ];
        this.set = 'PLB';
        this.name = 'Genesect EX';
        this.fullName = 'Genesect EX PLB';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '11';
    }
    reduceEffect(store, state, effect) {
        // Red Signal
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.target.cards.includes(this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasBench = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBench) {
                return state;
            }
            if (effect.energyCard.name === 'Plasma Energy') {
                const abilityLock = prefabs_1.IS_ABILITY_BLOCKED(store, state, effect.player, this);
                if (!abilityLock) {
                    prefabs_1.CONFIRMATION_PROMPT(store, state, effect.player, result => {
                        if (result) {
                            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                                if (wantToUse) {
                                    return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), result => {
                                        const cardList = result[0];
                                        opponent.switchPokemon(cardList);
                                    });
                                }
                            });
                        }
                    });
                }
            }
        }
        // Megalo Cannon
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON(20, effect, store, state);
        }
        return state;
    }
}
exports.GenesectEX = GenesectEX;
