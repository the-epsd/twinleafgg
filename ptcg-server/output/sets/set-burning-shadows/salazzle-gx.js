"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalazzleGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class SalazzleGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_GX];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Salandit';
        this.cardType = R;
        this.hp = 200;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Diabolical Claws',
                cost: [R, R],
                damage: 50,
                text: ' This attack does 50 damage for each Prize card you have taken.'
            },
            {
                name: 'Heat Blast',
                cost: [R, R],
                damage: 110,
                text: ''
            },
            {
                name: 'Queen\'s Haze-GX',
                cost: [R, R],
                damage: 0,
                gxAttack: true,
                text: 'Discard all Energy from your opponent\'s Active Pokémon. (You can\'t use more than 1 GX attack in a game.)'
            }
        ];
        this.set = 'BUS';
        this.setNumber = '25';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Salazzle-GX';
        this.fullName = 'Salazzle-GX BUS';
    }
    reduceEffect(store, state, effect) {
        // Diabolical Claws
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            effect.damage = (6 - player.getPrizeLeft()) * 50;
        }
        // Queen's Haze-GX
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[2]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Check if player has used GX attack
            if (player.usedGX == true) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_GX_USED);
            }
            // set GX attack as used for game
            player.usedGX = true;
            const opponentEnergy = new check_effects_1.CheckProvidedEnergyEffect(opponent, opponent.active);
            state = store.reduceEffect(state, opponentEnergy);
            const oppCards = [];
            opponentEnergy.energyMap.forEach(em => {
                oppCards.push(em.card);
            });
            const discardEnergy2 = new attack_effects_1.DiscardCardsEffect(effect, oppCards);
            discardEnergy2.target = opponent.active;
            store.reduceEffect(state, discardEnergy2);
        }
        return state;
    }
}
exports.SalazzleGX = SalazzleGX;
