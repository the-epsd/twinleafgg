"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TapuKokoPrismStar = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class TapuKokoPrismStar extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.tags = [card_types_1.CardTag.PRISM_STAR];
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.resistance = [{ type: card_types_1.CardType.METAL, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Dance of the Ancients',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), if this Pokémon is on your Bench, '
                    + 'you may choose 2 of your Benched Pokémon and attach a [L] Energy card from your discard pile to each of them.'
                    + 'If you do, discard all cards from this Pokémon and put it in the Lost Zone.'
            }];
        this.attacks = [{
                name: 'Mach Bolt',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS],
                damage: 120,
                text: ''
            }];
        this.set = 'TEU';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '51';
        this.name = 'Tapu Koko Prism Star';
        this.fullName = 'Tapu Koko Prism Star TEU';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            // Check to see if anything is blocking our Ability
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: game_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            if (player.active.cards[0] == this) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const benchIndex = player.bench.indexOf(cardList);
            if (benchIndex === -1) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const hasEnergyInDiscard = player.discard.cards.some(c => {
                return c instanceof game_1.EnergyCard
                    && c.energyType === card_types_1.EnergyType.BASIC
                    && c.provides.includes(card_types_1.CardType.LIGHTNING);
            });
            if (!hasEnergyInDiscard) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_ACTIVE, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Lightning Energy' }, { allowCancel: false, min: 1, max: 2, differentTargets: true }), transfers => {
                transfers = transfers || [];
                if (transfers.length === 0) {
                    return;
                }
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.discard.moveCardTo(transfer.card, target);
                }
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (cardList.getPokemonCard() === this) {
                        const pokemons = cardList.getPokemons();
                        cardList.moveCardsTo(pokemons, player.lostzone);
                        cardList.moveTo(player.discard);
                        cardList.clearEffects();
                    }
                });
                return state;
            });
        }
        return state;
    }
}
exports.TapuKokoPrismStar = TapuKokoPrismStar;
