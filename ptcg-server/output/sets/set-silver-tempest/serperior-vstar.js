"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SerperiorVSTAR = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class SerperiorVSTAR extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.VSTAR;
        this.evolvesFrom = 'Serperior V';
        this.cardType = game_1.CardType.GRASS;
        this.hp = 270;
        this.weakness = [{ type: game_1.CardType.FIRE }];
        this.retreat = [];
        this.tags = [game_1.CardTag.POKEMON_VSTAR];
        this.attacks = [
            {
                name: 'Regal Blender',
                cost: [game_1.CardType.GRASS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 190,
                text: 'You may move any amount of Energy from your Pokémon to your other Pokémon in any way you like.'
            },
            {
                name: 'Star Winder',
                cost: [game_1.CardType.GRASS],
                damage: 60,
                damageCalculation: 'x',
                text: 'This attack does 60 damage for each Energy attached to this Pokémon. Switch this Pokémon with 1 of your Benched Pokémon. (You can\'t use more than 1 VSTAR Power in a game.)'
            }
        ];
        this.set = 'SIT';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '8';
        this.name = 'Serperior VSTAR';
        this.fullName = 'Serperior VSTAR SIT 8';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            let energyCount = 0;
            checkProvidedEnergyEffect.energyMap.forEach(em => {
                energyCount = em.card.superType;
            });
            effect.damage = energyCount * 60;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            // const blockedMap: { source: CardTarget, blocked: number[] }[] = [];
            // player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
            //   const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, cardList);
            //   store.reduceEffect(state, checkProvidedEnergy);
            //   const blockedCards: Card[] = [];
            //   checkProvidedEnergy.energyMap.forEach(em => {
            //     if (em.provides.includes(CardType.ANY)) {
            //       blockedCards.push(em.card);
            //     }
            //   });
            //   const blocked: number[] = [];
            //   blockedCards.forEach(bc => {
            //     const index = cardList.cards.indexOf(bc);
            //     if (index !== -1 && !blocked.includes(index)) {
            //       blocked.push(index);
            //     }
            //   });
            //   if (blocked.length !== 0) {
            //     blockedMap.push({ source: target, blocked });
            //   }
            // });
            return store.prompt(state, new game_1.MoveEnergyPrompt(player.id, game_1.GameMessage.MOVE_ENERGY_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], // Only allow moving to active
            { superType: game_1.SuperType.ENERGY }, { min: 0, allowCancel: false }), transfers => {
                if (!transfers) {
                    return;
                }
                for (const transfer of transfers) {
                    // Can only move energy to the active Pokemon
                    const source = game_1.StateUtils.getTarget(state, player, transfer.from);
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    source.moveCardTo(transfer.card, target);
                }
                return state;
            });
        }
        return state;
    }
}
exports.SerperiorVSTAR = SerperiorVSTAR;
