"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hydreigon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
function* useDarkTrance(next, store, state, effect) {
    const player = effect.player;
    const blockedMap = [];
    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
        store.reduceEffect(state, checkProvidedEnergy);
        const blockedCards = [];
        checkProvidedEnergy.energyMap.forEach(em => {
            if (!em.provides.includes(card_types_1.CardType.DARK) && !em.provides.includes(card_types_1.CardType.ANY)) {
                blockedCards.push(em.card);
            }
        });
        const blocked = [];
        blockedCards.forEach(bc => {
            const index = cardList.cards.indexOf(bc);
            if (index !== -1 && !blocked.includes(index)) {
                blocked.push(index);
            }
        });
        if (blocked.length !== 0) {
            blockedMap.push({ source: target, blocked });
        }
    });
    return store.prompt(state, new game_1.MoveEnergyPrompt(effect.player.id, game_message_1.GameMessage.MOVE_ENERGY_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY }, { allowCancel: true, blockedMap }), transfers => {
        if (transfers === null) {
            return;
        }
        for (const transfer of transfers) {
            const source = game_1.StateUtils.getTarget(state, player, transfer.from);
            const target = game_1.StateUtils.getTarget(state, player, transfer.to);
            source.moveCardTo(transfer.card, target);
        }
    });
}
class Hydreigon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Zweilous';
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 150;
        this.weakness = [{ type: card_types_1.CardType.DRAGON }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Dark Trance',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'As often as you like during your turn (before your attack), ' +
                    'you may move a [D] Energy attached to 1 of your Pokemon to another ' +
                    'of your Pokemon.'
            }];
        this.attacks = [{
                name: 'Dragonblast',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.DARK, card_types_1.CardType.DARK, card_types_1.CardType.COLORLESS],
                damage: 140,
                text: 'Discard 2 [D] Energy attached to this Pokemon.'
            }];
        this.set = 'DRX';
        this.name = 'Hydreigon';
        this.fullName = 'Hydreigon DRX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '97';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const generator = useDarkTrance(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            state = store.prompt(state, new game_1.ChooseEnergyPrompt(player.id, game_message_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, checkProvidedEnergy.energyMap, [card_types_1.CardType.DARK, card_types_1.CardType.DARK], { allowCancel: false }), energy => {
                const cards = (energy || []).map(e => e.card);
                const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                discardEnergy.target = player.active;
                return store.reduceEffect(state, discardEnergy);
            });
        }
        return state;
    }
}
exports.Hydreigon = Hydreigon;
