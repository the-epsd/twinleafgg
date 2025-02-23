"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MrMime = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MrMime extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.cardType = P;
        this.hp = 90;
        this.stage = game_1.Stage.BASIC;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Pound',
                cost: [C],
                damage: 20,
                text: ''
            },
            {
                name: 'Tricky Slap',
                cost: [P, C, C],
                damage: 90,
                text: 'You and your opponent play Rock-Paper-Scissors until someone wins. If you win, during your opponent\'s next turn, prevent all damage from and effects of attacks done to this Pokémon.'
            }
        ];
        this.regulationMark = 'F';
        this.set = 'LOR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '67';
        this.name = 'Mr. Mime';
        this.fullName = 'Mr. Mime LOR';
        this.TRICKY_SLAP_MARKER = 'TRICKY_SLAP_MARKER';
        this.CLEAR_TRICKY_SLAP_MARKER = 'CLEAR_TRICKY_SLAP_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Tricky Slap
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            // our options (idk why value is here because it definitely isn't used at all but eh)
            const options = [
                { value: 'Rock', message: 'Rock' },
                { value: 'Paper', message: 'Paper' },
                { value: 'Scissors', message: 'Scissors' }
            ];
            // simultaneous prompt showing gaming
            store.prompt(state, [
                new game_1.SelectPrompt(player.id, game_1.GameMessage.CHOOSE_OPTION, options.map(c => c.message), { allowCancel: false }),
                new game_1.SelectPrompt(opponent.id, game_1.GameMessage.CHOOSE_OPTION, options.map(c => c.message), { allowCancel: false }),
            ], results => {
                // variable time
                const playerChosenValue = results[0];
                const opponentChosenValue = results[1];
                // outputting what both players chose
                store.log(state, game_1.GameLog.LOG_PLAYER_CHOOSES, { name: player.name, string: options[playerChosenValue].message });
                store.log(state, game_1.GameLog.LOG_PLAYER_CHOOSES, { name: opponent.name, string: options[opponentChosenValue].message });
                // if they tie, restart it
                if (playerChosenValue === opponentChosenValue) {
                    return this.reduceEffect(store, state, effect);
                }
                // Gotta make the win conditions
                if ((playerChosenValue === 1 && opponentChosenValue === 0)
                    || (playerChosenValue === 2 && opponentChosenValue === 1)
                    || (playerChosenValue === 0 && opponentChosenValue === 2)) {
                    player.active.marker.addMarker(this.TRICKY_SLAP_MARKER, this);
                    opponent.marker.addMarker(this.CLEAR_TRICKY_SLAP_MARKER, this);
                }
            });
        }
        // preventing damage is fun
        if ((effect instanceof attack_effects_1.PutDamageEffect || effect instanceof attack_effects_1.PutCountersEffect)
            && effect.target.cards.includes(this) && effect.target.marker.hasMarker(this.TRICKY_SLAP_MARKER, this)) {
            const pokemonCard = effect.target.getPokemonCard();
            const sourceCard = effect.source.getPokemonCard();
            // Card is not active, or damage source is unknown
            if (pokemonCard !== this || sourceCard === undefined)
                return state;
            // Do not ignore self-damage from Pokemon-Ex
            const player = game_1.StateUtils.findOwner(state, effect.target);
            const opponent = game_1.StateUtils.findOwner(state, effect.source);
            if (player === opponent || state.phase !== game_1.GamePhase.ATTACK) {
                return state;
            }
            effect.preventDefault = true;
        }
        // removing the thing
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_TRICKY_SLAP_MARKER, this)) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            effect.player.marker.removeMarker(this.CLEAR_TRICKY_SLAP_MARKER, this);
            opponent.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.marker.hasMarker(this.TRICKY_SLAP_MARKER, this)) {
                    cardList.marker.removeMarker(this.TRICKY_SLAP_MARKER, this);
                }
            });
        }
        return state;
    }
}
exports.MrMime = MrMime;
