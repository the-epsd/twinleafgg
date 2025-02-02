"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GreatTuskex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class GreatTuskex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.ANCIENT];
        this.cardType = F;
        this.hp = 250;
        this.weakness = [{ type: P }];
        this.retreat = [C, C, C, C];
        this.powers = [{
                name: 'Quaking Demolition',
                powerType: game_1.PowerType.ABILITY,
                text: 'Once at the end of your turn (after your attack), if this Pokémon is in the Active Spot, you must discard the top 5 cards of your deck.'
            }];
        this.attacks = [{
                name: 'Great Bash',
                cost: [F, C, C, C],
                damage: 260,
                text: 'This attack\'s damage isn\'t affected by any effects on your opponent\'s Active Pokémon.'
            }];
        this.set = 'PAF';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '53';
        this.name = 'Great Tusk ex';
        this.fullName = 'Great Tusk ex PAF';
    }
    reduceEffect(store, state, effect) {
        // Quaking Demolition (who wanted this why was this made in what context would anyone play this card without path to the peak in format)
        // even with path it didn't see play outside of an LDF video why was this made they could've added another semi-playable card but instead we got given this filth
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            try {
                const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                store.reduceEffect(state, powerEffect);
            }
            catch (_a) {
                return state;
            }
            if (player.active.getPokemonCard() === this) {
                player.deck.moveTo(player.discard, 5);
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const dealDamage = new attack_effects_1.DealDamageEffect(effect, 260);
            store.reduceEffect(state, dealDamage);
            const applyWeakness = new attack_effects_1.ApplyWeaknessEffect(effect, dealDamage.damage);
            store.reduceEffect(state, applyWeakness);
            const damage = applyWeakness.damage;
            effect.damage = 0;
            if (damage > 0) {
                opponent.active.damage += damage;
                const afterDamage = new attack_effects_1.AfterDamageEffect(effect, damage);
                state = store.reduceEffect(state, afterDamage);
            }
        }
        return state;
    }
}
exports.GreatTuskex = GreatTuskex;
