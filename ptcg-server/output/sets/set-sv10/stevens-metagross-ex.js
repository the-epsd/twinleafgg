"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StevensMetagrossex = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
function* useExboot(next, store, state, effect) {
    const player = effect.player;
    if (player.deck.cards.length === 0) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
    }
    const blocked = player.deck.cards
        .filter(c => c.name !== 'Psychic Energy' && c.name !== 'Metal Energy')
        .map(c => player.deck.cards.indexOf(c));
    const blockedTo = [];
    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        const checkPokemonTypeEffect = new check_effects_1.CheckPokemonTypeEffect(cardList);
        store.reduceEffect(state, checkPokemonTypeEffect);
        if (!checkPokemonTypeEffect.cardTypes.includes(card_types_1.CardType.PSYCHIC) &&
            !checkPokemonTypeEffect.cardTypes.includes(card_types_1.CardType.METAL)) {
            blockedTo.push(target);
        }
    });
    yield store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.deck, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: false, min: 0, max: 2, blocked, blockedTo }), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
            if (transfers.length > 1) {
                if (transfers[0].card.name === transfers[1].card.name) {
                    throw new game_1.GameError(game_1.GameMessage.CAN_ONLY_SELECT_TWO_DIFFERENT_ENERGY_TYPES);
                }
            }
            const target = game_1.StateUtils.getTarget(state, player, transfer.to);
            player.deck.moveCardTo(transfer.card, target);
            next();
        }
    });
    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class StevensMetagrossex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Steven\'s Metang';
        this.tags = [card_types_1.CardTag.STEVENS, card_types_1.CardTag.POKEMON_ex];
        this.cardType = M;
        this.hp = 340;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Exboot',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: ' Once during your turn, you may search your deck for a Basic [P] Energy card ' +
                    'and a Basic [M] Energy card and attach them to your [P] Pokémon or [M] Pokémon ' +
                    'in any way you like. Then, shuffle your deck.'
            }];
        this.attacks = [{ name: 'Metal Stop', cost: [M, C, C], damage: 200, text: '' }];
        this.regulationMark = 'I';
        this.set = 'SVOD';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '7';
        this.name = 'Steven\'s Metagross ex';
        this.fullName = 'Steven\'s Metagross ex SVOD';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const generator = useExboot(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.StevensMetagrossex = StevensMetagrossex;
