"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gurdurr = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Gurdurr extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Timburr';
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 100;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Knuckle Punch',
                cost: [card_types_1.CardType.FIGHTING],
                damage: 20,
                text: ''
            },
            {
                name: 'Superpower',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 50,
                text: 'You may do 30 more damage. If you do, this Pokémon also does 30 damage to itself.'
            },
        ];
        this.set = 'TWM';
        this.setNumber = '104';
        this.cardImage = 'assets/cardback.png';
        this.regulationMark = 'H';
        this.name = 'Gurdurr';
        this.fullName = 'Gurdurr TWM';
    }
    reduceEffect(store, state, effect) {
        // Superpower
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    effect.damage += 30;
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, 30);
                    damageEffect.target = player.active;
                    store.reduceEffect(state, damageEffect);
                }
            });
        }
        return state;
    }
}
exports.Gurdurr = Gurdurr;
