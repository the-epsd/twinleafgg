"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlutterMane = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
function* useLostMine(next, store, state, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    const maxAllowedDamage = [];
    let damageLeft = 0;
    opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
        const checkHpEffect = new check_effects_1.CheckHpEffect(opponent, cardList);
        store.reduceEffect(state, checkHpEffect);
        damageLeft += checkHpEffect.hp - cardList.damage;
        maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
    });
    const damage = Math.min(20, damageLeft);
    return store.prompt(state, new game_1.PutDamagePrompt(effect.player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], damage, maxAllowedDamage, { allowCancel: false }), targets => {
        const results = targets || [];
        for (const result of results) {
            const target = game_1.StateUtils.getTarget(state, player, result.target);
            const putCountersEffect = new attack_effects_1.PutCountersEffect(effect, result.damage);
            putCountersEffect.target = target;
            store.reduceEffect(state, putCountersEffect);
        }
    });
}
class FlutterMane extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'H';
        this.tags = [card_types_1.CardTag.ANCIENT];
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Witching Hour Flutter',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'As long as this Pokémon is in the Active Spot, your opponent\'s Active Pokémon has no Abilities, except for Witching Hour Flutter.'
            }];
        this.attacks = [{
                name: 'Flying Curse',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 90,
                text: 'Put 2 damage counters on your opponent\'s Benched Pokémon in any way you like.'
            }];
        this.set = 'TEF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '71';
        this.name = 'Flutter Mane';
        this.fullName = 'Flutter Mane TEF';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power.powerType === pokemon_types_1.PowerType.ABILITY) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Flutter Mane is not active Pokemon
            if (player.active.getPokemonCard() !== this
                && opponent.active.getPokemonCard() !== this) {
                return state;
            }
            const pokemon = opponent.active.getPokemonCard();
            if (pokemon && pokemon.powers && pokemon.powers.length > 0) {
                const pokemonCardList = new game_1.PokemonCardList();
                const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(pokemonCardList);
                store.reduceEffect(state, checkPokemonType);
            }
            // Try reducing ability for opponent
            try {
                const playerPowerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                store.reduceEffect(state, playerPowerEffect);
            }
            catch (_a) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const generator = useLostMine(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.FlutterMane = FlutterMane;
