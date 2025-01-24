"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TapuBuluGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
// BUS Tapu Bulu-GX 130 (https://limitlesstcg.com/cards/BUS/130)
class TapuBuluGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_GX];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 180;
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Horn Attack',
                cost: [card_types_1.CardType.GRASS],
                damage: 30,
                text: ''
            },
            {
                name: 'Nature\'s Judgement',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS],
                damage: 120,
                text: 'You may discard all Energy from this Pokémon. If you do, this attack does 60 more damage.'
            },
            {
                name: 'Tapu Wilderness-GX',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS],
                damage: 150,
                text: 'Heal all damage from this Pokémon. (You can\'t use more than 1 GX attack in a game.)'
            }
        ];
        this.set = 'BUS';
        this.setNumber = '130';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Tapu Bulu-GX';
        this.fullName = 'Tapu Bulu-GX BUS';
    }
    reduceEffect(store, state, effect) {
        // Jet Punch
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
                    state = store.reduceEffect(state, checkProvidedEnergy);
                    const cards = [];
                    checkProvidedEnergy.energyMap.forEach(em => {
                        cards.push(em.card);
                    });
                    const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                    discardEnergy.target = player.active;
                    store.reduceEffect(state, discardEnergy);
                    effect.damage += 60;
                }
            });
        }
        // Absorption GX
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[2]) {
            const player = effect.player;
            // Check if player has used GX attack
            if (player.usedGX == true) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_GX_USED);
            }
            // set GX attack as used for game
            player.usedGX = true;
            const healTargetEffect = new attack_effects_1.HealTargetEffect(effect, 990);
            healTargetEffect.target = player.active;
            state = store.reduceEffect(state, healTargetEffect);
        }
        return state;
    }
}
exports.TapuBuluGX = TapuBuluGX;
