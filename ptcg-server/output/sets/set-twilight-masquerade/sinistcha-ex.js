"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sinistchaex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Sinistchaex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Poltchageist';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 240;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Re-Brew',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Put 2 damage counters on 1 of your opponent\'s Pokémon for each Basic [G] Energy card in your discard pile. Then, shuffle those Energy cards into your deck.'
            },
            {
                name: 'Matcha Splash',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS],
                damage: 120,
                text: 'Heal 30 damage from each of your Pokémon.'
            },
        ];
        this.set = 'TWM';
        this.name = 'Sinistcha ex';
        this.fullName = 'Sinistcha ex TWM';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '23';
    }
    reduceEffect(store, state, effect) {
        // Re-Brew
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            // counting the energies
            const grassInDiscard = player.discard.cards.filter(c => c.superType === card_types_1.SuperType.ENERGY && c.name === 'Grass Energy').length;
            if (grassInDiscard === 0) {
                return state;
            }
            store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                const damageEffect = new attack_effects_1.PutCountersEffect(effect, 20 * grassInDiscard);
                damageEffect.target = targets[0];
                store.reduceEffect(state, damageEffect);
            });
            // slapping those energies back into the deck
            player.discard.cards.forEach(c => {
                if (c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC && c.name === 'Grass Energy') {
                    player.discard.moveCardTo(c, player.deck);
                }
            });
            return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                player.deck.applyOrder(order);
            });
        }
        // Matcha Splash
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                const healTargetEffect = new attack_effects_1.HealTargetEffect(effect, 30);
                healTargetEffect.target = cardList;
                state = store.reduceEffect(state, healTargetEffect);
            });
        }
        return state;
    }
}
exports.Sinistchaex = Sinistchaex;
