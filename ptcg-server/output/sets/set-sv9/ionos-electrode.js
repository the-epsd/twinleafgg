"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IonosElectrode = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class IonosElectrode extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.IONOS];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Iono\'s Voltorb';
        this.cardType = L;
        this.hp = 100;
        this.weakness = [{ type: F }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Heartpounding Bomb',
                cost: [L, L],
                damage: 0,
                text: 'This Pokémon does 100 damage to itself. Flip a coin. If heads, your opponent\'s Active Pokémon is Knocked Out.'
            },
            { name: 'Electric Ball', cost: [L, L, C], damage: 100, text: '' },
        ];
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.set = 'SV9';
        this.setNumber = '27';
        this.name = 'Iono\'s Electrode';
        this.fullName = 'Iono\'s Electrode SV9';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const dealDamage = new attack_effects_1.DealDamageEffect(effect, 100);
            dealDamage.target = player.active;
            store.reduceEffect(state, dealDamage);
            return store.prompt(state, new game_1.CoinFlipPrompt(effect.player.id, game_1.GameMessage.FLIP_COIN), (result) => {
                if (!result) {
                    const dealDamage = new attack_effects_1.KnockOutOpponentEffect(effect, 999);
                    dealDamage.target = opponent.active;
                    store.reduceEffect(state, dealDamage);
                }
            });
        }
        return state;
    }
}
exports.IonosElectrode = IonosElectrode;
