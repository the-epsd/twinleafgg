"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mimikyu = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Mimikyu extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 70;
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Impersonation',
                cost: [C],
                damage: 0,
                text: 'Discard a Supporter card from your hand. If you do, use the effect of that card as the effect of this attack.'
            },
            {
                name: 'Mischevious Hands',
                cost: [P],
                damage: 0,
                text: 'Choose 2 of your opponent\'s Pokémon and put 2 damage counters on each of them.'
            }
        ];
        this.set = 'CEC';
        this.name = 'Mimikyu';
        this.fullName = 'Mimikyu CEC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '96';
    }
    reduceEffect(store, state, effect) {
        // Impersonation
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const supportersInHand = player.hand.cards.filter(card => {
                card instanceof game_1.TrainerCard && card.trainerType === card_types_1.TrainerType.SUPPORTER;
            });
            if (!supportersInHand) {
                return state;
            }
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_COPY_EFFECT, player.hand, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.SUPPORTER }, { allowCancel: false, min: 1, max: 1 }), cards => {
                if (cards === null || cards.length === 0) {
                    return;
                }
                const trainerCard = cards[0];
                player.supporterTurn -= 1;
                player.hand.moveCardsTo(cards, player.discard);
                const playTrainerEffect = new play_card_effects_1.TrainerEffect(player, trainerCard);
                store.reduceEffect(state, playTrainerEffect);
            });
        }
        // Mischevous Hands
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasBenched = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                return state;
            }
            const benched = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
            const count = 1 + Math.min(1, benched);
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: count, max: count, allowCancel: false }), targets => {
                if (!targets || targets.length === 0) {
                    return;
                }
                targets.forEach(target => {
                    const counters = new attack_effects_1.PutCountersEffect(effect, 20);
                    counters.target = target;
                    store.reduceEffect(state, counters);
                });
            });
        }
        return state;
    }
}
exports.Mimikyu = Mimikyu;
