"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Minun = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Minun extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 60;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Sniff Out',
                cost: [C],
                damage: 0,
                text: 'Put any 1 card from your discard pile into your hand.'
            },
            {
                name: 'Negative Spark',
                cost: [L],
                damage: 0,
                text: 'Does 20 damage to each of your opponent\'s Pokémon that has any Poké- Bodies. Don\'t apply Weakness and Resistance.'
            }];
        this.set = 'DX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '41';
        this.name = 'Minun';
        this.fullName = 'Minun DX';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            if (player.discard.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
            }
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, {}, { min: 1, max: 1, allowCancel: false }), cards => {
                player.discard.moveCardsTo(cards, player.hand);
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let benchPokemon = [];
            const pokemonWithAbilities = [];
            const opponentActive = opponent.active.getPokemonCard();
            const stubPowerEffectForActive = new game_effects_1.PowerEffect(opponent, {
                name: 'test',
                powerType: game_1.PowerType.POKEBODY,
                text: ''
            }, opponent.active.getPokemonCard());
            try {
                store.reduceEffect(state, stubPowerEffectForActive);
                if (opponentActive && opponentActive.powers.length) {
                    pokemonWithAbilities.push(opponent.active);
                }
            }
            catch (_a) {
                // no abilities in active
            }
            if (opponent.bench.some(b => b.cards.length > 0)) {
                const stubPowerEffectForBench = new game_effects_1.PowerEffect(opponent, {
                    name: 'test',
                    powerType: game_1.PowerType.POKEBODY,
                    text: ''
                }, opponent.bench.filter(b => b.cards.length > 0)[0].getPokemonCard());
                try {
                    store.reduceEffect(state, stubPowerEffectForBench);
                    benchPokemon = opponent.bench.map(b => b).filter(card => card !== undefined);
                    pokemonWithAbilities.push(...benchPokemon.filter(card => { var _a; return (_a = card.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.powers.length; }));
                }
                catch (_b) {
                    // no abilities on bench
                }
            }
            effect.ignoreWeakness = true;
            effect.ignoreResistance = true;
            pokemonWithAbilities.forEach(target => {
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 20);
                damageEffect.target = target;
                store.reduceEffect(state, damageEffect);
            });
            return state;
        }
        return state;
    }
}
exports.Minun = Minun;
