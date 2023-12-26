"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ditto = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
function* useApexDragon(next, store, state, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    const discardPokemon = player.discard.cards
        .filter(card => card.superType === card_types_1.SuperType.POKEMON);
    const basicPokemon = discardPokemon.filter(card => card.stage === card_types_1.Stage.BASIC && card.tags === undefined);
    if (basicPokemon.length === 0) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
        return state;
    }
    let selected;
    yield store.prompt(state, new game_1.ChooseAttackPrompt(player.id, game_1.GameMessage.CHOOSE_ATTACK_TO_COPY, basicPokemon, { allowCancel: false }), result => {
        selected = result;
        next();
    });
    const attack = selected;
    // Get energy required for the attack
    const requiredEnergy = attack === null || attack === void 0 ? void 0 : attack.cost;
    // Check if Ditto (the active Pokemon) has the required energy
    if (!player.active.cards.some(c => c instanceof pokemon_card_1.PokemonCard && (requiredEnergy === null || requiredEnergy === void 0 ? void 0 : requiredEnergy.includes(c.cardType)))) {
        return state;
    }
    if (!attack) {
        return state;
    }
    store.log(state, game_1.GameLog.LOG_PLAYER_COPIES_ATTACK, {
        name: player.name,
        attack: attack.name
    });
    // Perform attack
    const attackEffect = new game_effects_1.AttackEffect(player, opponent, attack);
    store.reduceEffect(state, attackEffect);
    if (store.hasPrompts()) {
        yield store.waitPrompt(state, () => next());
    }
    if (attackEffect.damage > 0) {
        const dealDamage = new attack_effects_1.DealDamageEffect(attackEffect, attackEffect.damage);
        state = store.reduceEffect(state, dealDamage);
    }
    return state;
}
class Ditto extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'F';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Hidden Transormation',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'This Pokémon can use the attacks of any Basic Pokémon in your discard pile, except for Pokémon with a Rule Box (Pokémon V, Pokémon-GX, etc. have Rule Boxes). (You still need the necessary Energy to use each attack.)'
            }];
        this.set = 'PGO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '53';
        this.name = 'Ditto';
        this.fullName = 'Ditto PGO';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const generator = useApexDragon(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Ditto = Ditto;
