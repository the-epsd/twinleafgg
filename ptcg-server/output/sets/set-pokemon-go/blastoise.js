"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blastoise = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
function* useVitalitySpring(next, store, state, effect) {
    const player = effect.player;
    if (player.deck.cards.length === 0) {
        return state;
    }
    yield store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.deck, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: 0, max: 6 }), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
            const target = game_1.StateUtils.getTarget(state, player, transfer.to);
            player.deck.moveCardTo(transfer.card, target);
            next();
        }
    });
    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
        const endTurnEffect = new game_phase_effects_1.EndTurnEffect(player);
        store.reduceEffect(state, endTurnEffect);
        return state;
    });
}
class Blastoise extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Wartortle';
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 170;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Vitality Spring',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, you may search your deck for up to 6 Energy cards and attach them to your Pokémon in any way you like. Then, shuffle your deck. If you use this Ability, your turn ends.'
            }];
        this.attacks = [
            {
                name: 'Hydro Pump',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 90,
                text: 'This attack does 30 more damage for each [W] Energy attached to this Pokémon.'
            }
        ];
        this.set = 'PGO';
        this.name = 'Blastoise';
        this.fullName = 'Blastoise PGO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '17';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            let energyCount = 0;
            checkProvidedEnergyEffect.energyMap.forEach(em => {
                energyCount += em.provides.filter(cardType => {
                    return cardType === card_types_1.CardType.WATER || cardType === card_types_1.CardType.ANY;
                }).length;
            });
            effect.damage += energyCount * 30;
            return state;
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const generator = useVitalitySpring(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Blastoise = Blastoise;
