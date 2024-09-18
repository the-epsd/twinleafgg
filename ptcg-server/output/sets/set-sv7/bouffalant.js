"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bouffalant = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Bouffalant extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.COLORLESS;
        this.hp = 100;
        this.weakness = [{ type: game_1.CardType.FIGHTING }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Curly Wall',
                powerType: game_1.PowerType.ABILITY,
                text: 'If you have any other Bouffalant in play, each of your Basic [C] Pokémon take 60 less damage from your opponent\'s attacks(after applying Weakness and Resistance).You can\'t apply more than 1 Curly Wall Ability at a time.'
            }];
        this.attacks = [{
                name: 'Boundless Power',
                cost: [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 130,
                text: 'During your next turn, this Pokémon can\'t attack.'
            }];
        this.set = 'SCR';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '119';
        this.name = 'Bouffalant';
        this.fullName = 'Bouffalant SV7';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutDamageEffect) {
            const cardList = game_1.StateUtils.findCardList(state, this);
            const player = game_1.StateUtils.findOwner(state, cardList);
            let bouffalantCount = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card.name === 'Bouffalant') {
                    bouffalantCount++;
                }
            });
            if (bouffalantCount < 2) {
                return state;
            }
            if (state.phase !== game_1.GamePhase.ATTACK) {
                return state;
            }
            if (effect.damageReduced) {
                return state;
            }
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: game_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            const targetPokemon = effect.target.getPokemonCard();
            if (targetPokemon && targetPokemon.cardType === game_1.CardType.COLORLESS && targetPokemon.stage === game_1.Stage.BASIC && game_1.StateUtils.findOwner(state, effect.target) === player) {
                effect.damage = Math.max(0, effect.damage - 60);
                effect.damageReduced = true;
            }
        }
        return state;
    }
}
exports.Bouffalant = Bouffalant;
