"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Starmie = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Starmie extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Staryu';
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Multishot Star',
                cost: [card_types_1.CardType.WATER],
                damage: 0,
                text: 'Discard any amount of [W] Energy from this Pokémon. Then, for each Energy you discarded in this way, choose 1 of your opponent\'s Pokémon and do 30 damage to it. (You can choose the same Pokémon more than once.) This damage isn\'t affected by Weakness or Resistance. '
            }];
        this.set = 'FST';
        this.regulationMark = 'E';
        this.setNumber = '53';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Starmie';
        this.fullName = 'Starmie FST';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const blocked = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (cardList.cards.some(c => c instanceof game_1.EnergyCard && c.provides.includes(card_types_1.CardType.WATER))) {
                    blocked.push();
                }
                if (cardList.cards.some(c => c instanceof game_1.EnergyCard && c.provides.includes(card_types_1.CardType.ANY))) {
                    blocked.push();
                }
                if (cardList.cards.some(c => c instanceof game_1.EnergyCard && c.blendedEnergies.includes(card_types_1.CardType.WATER))) {
                    blocked.push();
                }
            });
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, player.active, // Card source is target Pokemon
            { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, blocked: blocked }), selected => {
                const cards = selected || [];
                if (cards.length > 0) {
                    const energyToDiscard = new game_1.CardList();
                    energyToDiscard.cards.push(...cards);
                    const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, energyToDiscard.cards);
                    discardEnergy.target = player.active;
                    store.reduceEffect(state, discardEnergy);
                    const damage = cards.length * 30;
                    const maxAllowedDamage = [];
                    opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                        maxAllowedDamage.push({ target, damage: card.hp + damage });
                    });
                    return store.prompt(state, new game_1.PutDamagePrompt(effect.player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], damage, maxAllowedDamage, { allowCancel: false, damageMultiple: 30 }), targets => {
                        const results = targets || [];
                        for (const result of results) {
                            const target = game_1.StateUtils.getTarget(state, player, result.target);
                            const putCountersEffect = new attack_effects_1.PutCountersEffect(effect, result.damage);
                            putCountersEffect.target = target;
                            store.reduceEffect(state, putCountersEffect);
                        }
                    });
                }
                return state;
            });
        }
        return state;
    }
}
exports.Starmie = Starmie;
