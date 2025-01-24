"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlolanNinetalesGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_2 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const state_utils_1 = require("../../game/store/state-utils");
const attack_effects_2 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
// GRI Alolan Ninetales-GX 22 (https://limitlesstcg.com/cards/GRI/22)
class AlolanNinetalesGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_GX];
        this.stage = card_types_1.Stage.BASIC;
        this.evolvesFrom = 'Alolan Vulpix';
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 210;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Ice Blade',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'This attack does 50 damage to 1 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Blizzard Edge',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS],
                damage: 160,
                text: 'Discard 2 Energy from this Pokémon.'
            },
            {
                name: 'Ice Path-GX',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Move all damage counters from this Pokémon to your opponent\'s Active Pokémon. (You can\'t use more than 1 GX attack in a game.)'
            }
        ];
        this.set = 'GRI';
        this.name = 'Alolan Ninetales-GX';
        this.fullName = 'Alolan Ninetales-GX GRI';
        this.setNumber = '22';
        this.cardImage = 'assets/cardback.png';
    }
    reduceEffect(store, state, effect) {
        // Ice Blade
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, new game_2.ChoosePokemonPrompt(player.id, game_2.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_2.PlayerType.TOP_PLAYER, [game_2.SlotType.ACTIVE, game_2.SlotType.BENCH], { allowCancel: false }), targets => {
                if (!targets || targets.length === 0) {
                    return;
                }
                const damageEffect = new attack_effects_2.PutDamageEffect(effect, 50);
                damageEffect.target = targets[0];
                store.reduceEffect(state, damageEffect);
            });
        }
        // Blizzard Edge
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            if (!player.active.cards.some(c => c instanceof game_2.EnergyCard)) {
                return state;
            }
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            state = store.prompt(state, new game_1.ChooseEnergyPrompt(player.id, game_2.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, checkProvidedEnergy.energyMap, [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS], { allowCancel: false }), energy => {
                const cards = (energy || []).map(e => e.card);
                const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                discardEnergy.target = player.active;
                store.reduceEffect(state, discardEnergy);
            });
        }
        // Ice Path-GX
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[2]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            // Check if player has used GX attack
            /*      if (player.usedGX == true) {
              throw new GameError(GameMessage.LABEL_GX_USED);
            }
            // set GX attack as used for game
            player.usedGX = true; */
            opponent.active.damage += player.active.damage;
            player.active.damage = 0;
        }
        return state;
    }
}
exports.AlolanNinetalesGX = AlolanNinetalesGX;
