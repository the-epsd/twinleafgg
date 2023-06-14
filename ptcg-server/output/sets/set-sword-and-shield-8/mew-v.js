"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MewV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const { MewV } = require("./mew-v");
    
function* useEnergyMix(next, store, state, effect) {
    const player = effect.player;
    if (player.deck.cards.length === 0) {
        return state;
    }
    const hasBenched = player.bench.some(b => b.cards.length > 0);
    if (!hasBenched) {
        return state;
    }
    let cards = [];
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.ENERGY, name: 'Grass Energy' }, { min: 1, max: 2, allowCancel: true }), selected => {
        cards = selected || [];
        next();
    });
    if (cards.length > 0) {
        yield store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_ATTACH_CARDS, game_1.PlayerType.BOTTOM_PLAYER, game_1.CardTag.FUSION_STRIKE, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: true }), targets => {
            if (!targets || targets.length === 0) {
                return;
            }
            const target = targets[0];
            player.deck.moveCardsTo(cards, target);
            next();
        });
    }
    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
    function* usePsychicLeap(next, store, state, effect) {
        const player = effect.player;
    }
        if (player.deck.cards.length === 0) {
            return state;
        }
    reduceEffect(store, state, effect) 

            return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_PICK_UP, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE], { allowCancel: true }), result => {
                const targets = result || [];
                // Operation cancelled by user
                if (targets.length === 0) {
                    return;
                }
                targets.forEach(target => {
                    target.moveTo(player.deck);
                    return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
                        player.deck.applyOrder(order);
                    });
                })
class MewV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_V];
        this.tags = [card_types_1.CardTag.FUSION_STRIKE];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 180;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [];
        this.attacks = [{
                name: 'Energy Mix',
                cost: [card_types_1.CardType.COLORLESS],
                text: 'Search your deck for an Energy card and attach it to 1 of ' +
                'your Fusion Strike Pokémon. Then, shuffle your deck. '
            }];
        this.attacks = [
            {
                name: 'Psychic Leap',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS],
                damage: 70,
                text: 'You may shuffle this Pokémon and all attached cards into ' +
                'your deck. '
            }
        ];
        this.set = 'SSH8';
        this.name = 'Mew V';
        this.fullName = 'Mew V FST 250';
    }


        }
        return state;
    })
}
    
exports.MewV = MewV;
    