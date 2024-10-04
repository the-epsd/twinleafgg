"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bastiodon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Bastiodon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 160;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.PSYCHIC, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.evolvesFrom = 'Shieldon';
        this.powers = [{
                name: 'Earthen Shield',
                powerType: game_1.PowerType.ABILITY,
                text: 'Prevent all damage done to your [M] Pokémon by attacks from your opponent\'s Pokémon that have any Special Energy attached to them.'
            }];
        this.attacks = [{
                name: 'Push Down',
                cost: [card_types_1.CardType.METAL, card_types_1.CardType.METAL, card_types_1.CardType.COLORLESS],
                damage: 110,
                text: 'You may have your opponent switch their Active Pokémon with 1 of their Benched Pokémon.'
            }];
        this.set = 'UPR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '85';
        this.name = 'Bastiodon';
        this.fullName = 'Bastiodon UPR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutDamageEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
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
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player, player.active);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            const opponentHasSpecialEnergy = checkProvidedEnergyEffect.energyMap.some(e => e.card.energyType === card_types_1.EnergyType.SPECIAL);
            console.log('Opponent has special energy: ' + opponentHasSpecialEnergy);
            const checkPokemonTypeEffect = new check_effects_1.CheckPokemonTypeEffect(opponent.active);
            store.reduceEffect(state, checkPokemonTypeEffect);
            console.log('Bastiodon owner has metal type in active: ' + checkPokemonTypeEffect.cardTypes.includes(card_types_1.CardType.METAL));
            if (opponentHasSpecialEnergy && checkPokemonTypeEffect.cardTypes.includes(card_types_1.CardType.METAL)) {
                effect.preventDefault = true;
                return state;
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasBench = opponent.bench.some(b => b.cards.length > 0);
            if (hasBench === false) {
                return state;
            }
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    return store.prompt(state, new game_1.ChoosePokemonPrompt(opponent.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                        if (targets && targets.length > 0) {
                            opponent.active.clearEffects();
                            opponent.switchPokemon(targets[0]);
                            return state;
                        }
                    });
                }
            });
        }
        return state;
    }
}
exports.Bastiodon = Bastiodon;
