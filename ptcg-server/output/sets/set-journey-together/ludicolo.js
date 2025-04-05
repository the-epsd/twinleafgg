"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ludicolo = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Ludicolo extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Lombre';
        this.cardType = W;
        this.hp = 140;
        this.weakness = [{ type: L }];
        this.retreat = [C, C];
        this.powers = [
            {
                name: 'Vital Samba',
                powerType: game_1.PowerType.ABILITY,
                text: 'Your Pokémon in play get +40 HP. This Ability doesn\'t stack.'
            }
        ];
        this.attacks = [{ name: 'Hydro Splash', cost: [W, W, C], damage: 130, text: '' }];
        this.set = 'JTG';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '37';
        this.name = 'Ludicolo';
        this.fullName = 'Ludicolo JTG';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckHpEffect) {
            const cardList = game_1.StateUtils.findCardList(state, this);
            const player = game_1.StateUtils.findOwner(state, cardList);
            if (!game_1.StateUtils.isPokemonInPlay(player, this) || prefabs_1.IS_ABILITY_BLOCKED(store, state, player, this) || effect.hpBoosted) {
                return state;
            }
            effect.hp += 40;
            effect.hpBoosted = true;
        }
        return state;
    }
}
exports.Ludicolo = Ludicolo;
