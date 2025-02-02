"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GarchompUNM = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class GarchompUNM extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Gabite';
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 150;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [];
        this.powers = [{
                name: 'Avenging Aura',
                powerType: game_1.PowerType.ABILITY,
                text: 'If you have more Prize cards remaining than your opponent, this Pokémon\'s attacks do 80 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance). '
            }];
        this.attacks = [
            {
                name: 'Over Slice',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS],
                damage: 80,
                text: 'You may discard an Energy from this Pokémon. If you do, this attack does 40 more damage.'
            }
        ];
        this.set = 'UNM';
        this.setNumber = '114';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Garchomp';
        this.fullName = 'Garchomp UNM';
    }
    reduceEffect(store, state, effect) {
        // Avenging Aura
        if (effect instanceof attack_effects_1.DealDamageEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const oppActive = opponent.active.getPokemonCard();
            const damageSource = effect.source.getPokemonCard();
            // checking if it's your attack
            if (damageSource && damageSource === oppActive) {
                return state;
            }
            // checking if the damage is caused by this garchomp
            if (damageSource && damageSource !== this) {
                return state;
            }
            // why must i check for ability lock so much can we just force it into the source code officially
            try {
                const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                store.reduceEffect(state, powerEffect);
            }
            catch (_a) {
                return state;
            }
            if (opponent.getPrizeLeft() < player.getPrizeLeft()) {
                effect.damage += 80;
            }
        }
        // Over Slice
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
                    state = store.reduceEffect(state, checkProvidedEnergy);
                    state = store.prompt(state, new game_1.ChooseEnergyPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, checkProvidedEnergy.energyMap, [card_types_1.CardType.COLORLESS], { allowCancel: false }), energy => {
                        const cards = (energy || []).map(e => e.card);
                        const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                        discardEnergy.target = player.active;
                        store.reduceEffect(state, discardEnergy);
                        effect.damage += 40;
                    });
                }
            });
        }
        return state;
    }
}
exports.GarchompUNM = GarchompUNM;
