"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stoutland = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Stoutland extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 140;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.evolvesFrom = 'Herdier';
        this.powers = [{
                name: 'Sentinel',
                powerType: game_1.PowerType.ABILITY,
                text: ' As long as this Pokémon is your Active Pokémon, your opponent can\'t play any Supporter cards from his or her hand.'
            }];
        this.attacks = [{
                name: 'Wild Tackle',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 90,
                text: 'Flip a coin. If tails, this Pokémon does 20 damage to itself.'
            }];
        this.set = 'BCR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '122';
        this.name = 'Stoutland';
        this.fullName = 'Stoutland BCR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlaySupporterEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.active.getPokemonCard() !== this && opponent.active.getPokemonCard() !== this) {
                return state;
            }
            // Checking to see if ability is being blocked
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
            if (opponent.active.getPokemonCard() === this) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], result => {
                if (!result) {
                    const dealDamage = new attack_effects_1.DealDamageEffect(effect, 10);
                    dealDamage.target = player.active;
                    return store.reduceEffect(state, dealDamage);
                }
            });
        }
        return state;
    }
}
exports.Stoutland = Stoutland;
