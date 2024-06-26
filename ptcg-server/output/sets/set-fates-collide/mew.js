"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mew = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
function* useGenomeHacking(next, store, state, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    const providedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player, player.active);
    store.reduceEffect(state, providedEnergyEffect);
    const blocked = [];
    player.bench.forEach((b, i) => {
        const pokemonCard = b.getPokemonCard();
        if (!pokemonCard || pokemonCard.stage !== card_types_1.Stage.BASIC) {
            return;
        }
        pokemonCard.attacks.forEach(attack => {
            if (!game_1.StateUtils.checkEnoughEnergy(providedEnergyEffect.energyMap, attack.cost)) {
                blocked.push({ index: i, attack: attack.name });
            }
        });
    });
    const benchedBasics = player.bench.map(b => b.getPokemonCard())
        .filter(b => !!b && b.stage === card_types_1.Stage.BASIC);
    if (blocked.length === benchedBasics.reduce((sum, curr) => sum + curr.attacks.length, 0)) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
    }
    let selected;
    yield store.prompt(state, new game_1.ChooseAttackPrompt(player.id, game_1.GameMessage.CHOOSE_ATTACK_TO_COPY, benchedBasics, { allowCancel: false, blocked }), result => {
        selected = result;
        next();
    });
    const attack = selected;
    if (attack === null) {
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
class Mew extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 50;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [];
        this.powers = [{
                name: 'Memories of Dawn',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'This Pokémon can use the attacks of any of your Basic Pokémon in play. (You still need the necessary Energy to use each attack.)'
            }];
        this.attacks = [{
                name: 'Encounter',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Search your deck for a Pokémon, reveal it, and put it into your hand. Shuffle your deck afterward.'
            }];
        this.set = 'FCO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '29';
        this.name = 'Mew';
        this.fullName = 'Mew FCO';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (!player.bench.some(c => c.cards.length > 0) || !player.bench.some(c => c.stage === card_types_1.Stage.BASIC)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            try {
                const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                state = store.reduceEffect(state, powerEffect);
            }
            catch (_a) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const generator = useGenomeHacking(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            return store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARD_TO_DECK, player.discard, { superType: card_types_1.SuperType.POKEMON }, { min: 0, max: 1, allowCancel: false }), selected => {
                selected.forEach((card, index) => {
                    store.log(state, game_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
                });
                store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, selected), () => { });
                return state;
            });
        }
        return state;
    }
}
exports.Mew = Mew;
