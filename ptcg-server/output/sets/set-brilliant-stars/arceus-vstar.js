"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArceusVSTAR = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
function* useTrinityNova(next, store, state, effect) {
    const player = effect.player;
    if (player.deck.cards.length === 0) {
        return state;
    }
    const blocked = [];
    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (!cardList.vPokemon()) {
            blocked.push(target);
        }
    });
    yield store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.deck, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: false, min: 0, max: 3, blockedTo: blocked }), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
            const target = game_1.StateUtils.getTarget(state, player, transfer.to);
            player.deck.moveCardTo(transfer.card, target);
            next();
        }
    });
    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class ArceusVSTAR extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_VSTAR];
        this.regulationMark = 'F';
        this.stage = card_types_1.Stage.VSTAR;
        this.evolvesFrom = 'Arceus V';
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 280;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Trinity Nova',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 200,
                text: 'Search your deck for up to 3 basic energies and attach ' +
                    'them to your Pokémon V in any way you like. Then, shuffle ' +
                    'your deck.'
            }
        ];
        this.powers = [{
                name: 'Starbirth',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'During your turn, you may search your deck for up to ' +
                    '2 cards and put them into your hand. Then, shuffle your ' +
                    'deck. (You can\'t use more than 1 VSTAR Power in a game.)'
            }];
        this.set = 'BRS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '123';
        this.name = 'Arceus VSTAR';
        this.fullName = 'Arceus VSTAR BRS';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.usedVSTAR) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_VSTAR_USED);
            }
            player.usedVSTAR = true;
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {}, { min: 1, max: 2, allowCancel: false }), cards => {
                player.deck.moveCardsTo(cards, player.hand);
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (cardList.getPokemonCard() === this) {
                        cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                    }
                });
                state = store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
                return state;
            });
        }
        //     if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
        //       const player = effect.player;
        //       state = store.prompt(state, new AttachEnergyPrompt(
        //         player.id,
        //         GameMessage.ATTACH_ENERGY_TO_BENCH,
        //         player.deck,
        //         PlayerType.BOTTOM_PLAYER,
        //         [ SlotType.BENCH, SlotType.ACTIVE ],
        //         { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        //         { allowCancel: true, min: 0, max: 3 },
        //       ), transfers => {
        //         transfers = transfers || [ ];
        //         // cancelled by user
        //         if (transfers.length === 0) {
        //           return state;
        //         }
        //         for (const transfer of transfers) {
        //           const target = StateUtils.getTarget(state, player, transfer.to);
        //           if (!target.cards[0].tags.includes(CardTag.POKEMON_V) ||
        //           !target.cards[0].tags.includes(CardTag.POKEMON_VSTAR) ||
        //           !target.cards[0].tags.includes(CardTag.POKEMON_VMAX)) {
        //             throw new GameError(GameMessage.INVALID_TARGET);
        //           }
        //           if (target.cards[0].tags.includes(CardTag.POKEMON_V) || 
        //               target.cards[0].tags.includes(CardTag.POKEMON_VSTAR) ||
        //               target.cards[0].tags.includes(CardTag.POKEMON_VMAX)) {
        //             player.deck.moveCardTo(transfer.card, target); 
        //           }
        //         }
        //         state = store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
        //           player.deck.applyOrder(order);
        //         });
        //       });
        //     }
        //     return state;
        //   }
        // }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const generator = useTrinityNova(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.ArceusVSTAR = ArceusVSTAR;
