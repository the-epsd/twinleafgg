"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reshiram = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Reshiram extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 120;
        this.weakness = [{ type: W }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Amazing Blaze',
                cost: [R, L, D],
                damage: 270,
                text: 'This Pokémon also does 60 damage to itself.'
            }];
        this.set = 'SHF';
        this.regulationMark = 'D';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '17';
        this.name = 'Reshiram';
        this.fullName = 'Reshiram SHF';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const dealDamage = new attack_effects_1.PutDamageEffect(effect, 60);
            dealDamage.target = player.active;
            return store.reduceEffect(state, dealDamage);
        }
        return state;
    }
}
exports.Reshiram = Reshiram;
