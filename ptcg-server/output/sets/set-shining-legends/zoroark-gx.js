"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZoroarkGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
// citing empoleon to help make this (https://github.com/keeshii/ryuu-play/blob/master/ptcg-server/src/sets/set-black-and-white/empoleon.ts)
function* useTricksterGX(next, store, state, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    const oppActive = opponent.active.getPokemonCard();
    const oppBenched = opponent.bench.filter(b => b.cards.length > 0);
    const allOpponentPokemon = oppActive ? [oppActive, ...oppBenched.map(b => b.getPokemonCard())].filter((pokemon) => pokemon !== undefined) : [];
    // Check if player has used GX attack
    if (player.usedGX == true) {
        throw new game_1.GameError(game_1.GameMessage.LABEL_GX_USED);
    }
    let selected;
    yield store.prompt(state, new game_1.ChooseAttackPrompt(player.id, game_1.GameMessage.CHOOSE_ATTACK_TO_COPY, allOpponentPokemon, { allowCancel: false }), result => {
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
    // set GX attack as used for game
    player.usedGX = true;
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
class ZoroarkGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_GX];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Zorua';
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 210;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Trade',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), you may discard a card from your hand. If you do, draw 2 cards.'
            }];
        this.attacks = [
            {
                name: 'Riotous Beating',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'This attack does 20 damage for each of your Pokémon in play.'
            },
            {
                name: 'Trickster-GX',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.DARK],
                damage: 0,
                gxAttack: true,
                text: 'Choose 1 of your opponent\'s Pokémon\'s attacks and use it as this attack. (You can\'t use more than 1 GX attack in a game.)'
            }
        ];
        this.set = 'SLG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '53';
        this.name = 'Zoroark-GX';
        this.fullName = 'Zoroark GX SLG';
        this.TRADE_MARKER = 'TRADE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.TRADE_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.hand.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.TRADE_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, {}, { allowCancel: true, min: 1, max: 1 }), cards => {
                cards = cards || [];
                if (cards.length === 0) {
                    return;
                }
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (cardList.getPokemonCard() === this) {
                        cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                    }
                });
                player.marker.addMarker(this.TRADE_MARKER, this);
                player.hand.moveCardsTo(cards, player.discard);
                player.deck.moveTo(player.hand, 2);
            });
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            let pokemonInPlay = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, () => { pokemonInPlay += 1; });
            effect.damage = 20 * pokemonInPlay;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const generator = useTricksterGX(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.TRADE_MARKER, this);
        }
        return state;
    }
}
exports.ZoroarkGX = ZoroarkGX;
