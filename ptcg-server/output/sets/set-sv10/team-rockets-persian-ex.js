"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamRocketsPersianex = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
function* useHaughtyOrders(next, store, state, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    if (opponent.deck.cards.length === 0) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
    }
    const opponentTop10 = new game_1.CardList();
    opponent.deck.moveTo(opponentTop10, Math.min(10, opponent.deck.cards.length));
    const toppedPokemon = opponentTop10.cards.filter(card => card.superType === game_1.SuperType.POKEMON);
    // showing the prompt to both players at the same time, although this is having a weird effect where if the user tries to use an attack before the opponent has confirmed their side of the prompt, the effect won't go through but the damage does
    store.prompt(state, [
        new game_1.ShowCardsPrompt(player.id, game_1.GameMessage.CARDS_SHOWED_BY_EFFECT, opponentTop10.cards, { allowCancel: false }),
        new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_EFFECT, opponentTop10.cards, { allowCancel: false }),
    ], results => {
        opponentTop10.moveTo(opponent.deck);
        prefabs_1.SHUFFLE_DECK(store, state, opponent);
    });
    // if there's no pokemon in the top ten cards, move on
    if (toppedPokemon.length === 0) {
        return state;
    }
    for (let retryCount = 0; retryCount < 3; retryCount++) {
        let selected;
        yield store.prompt(state, new game_1.ChooseAttackPrompt(player.id, game_1.GameMessage.CHOOSE_ATTACK_TO_COPY, toppedPokemon, { allowCancel: true }), result => {
            selected = result;
            next();
        });
        const attack = selected;
        if (attack === null) {
            return state; // Player chose to cancel
        }
        try {
            store.log(state, game_1.GameLog.LOG_PLAYER_COPIES_ATTACK, {
                name: player.name,
                attack: attack.name
            });
            const attackEffect = new game_effects_1.AttackEffect(player, opponent, attack);
            state = store.reduceEffect(state, attackEffect);
            if (store.hasPrompts()) {
                yield store.waitPrompt(state, () => next());
            }
            if (attackEffect.damage > 0) {
                const dealDamage = new attack_effects_1.DealDamageEffect(attackEffect, attackEffect.damage);
                state = store.reduceEffect(state, dealDamage);
            }
            return state; // Successfully executed attack, exit the function
        }
        catch (error) {
            console.log('Attack failed:', error);
            retryCount++;
            if (retryCount >= 3) {
                console.log('Max retries reached. Exiting loop.');
                return state;
            }
        }
    }
}
class TeamRocketsPersianex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Team Rocket\'s Meowth';
        this.tags = [game_1.CardTag.TEAM_ROCKET, game_1.CardTag.POKEMON_ex];
        this.cardType = C;
        this.hp = 260;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Haughty Orders',
                cost: [C, C],
                damage: 0,
                text: 'Your opponent reveals the top 10 cards of their deck. You may choose an attack from a Pokemon you find there and use it as this attack. Your opponent shuffles the revealed cards back into their deck.'
            },
            {
                name: 'Slash and Cash',
                cost: [C, C, C],
                damage: 140,
                text: 'Your opponent\'s Active Pokemon is now Confused.'
            }
        ];
        this.set = 'SV10';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '79';
        this.name = 'Team Rocket\'s Persian ex';
        this.fullName = 'Team Rocket\'s Persian ex SV10';
    }
    reduceEffect(store, state, effect) {
        // Haughty Orders
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const generator = useHaughtyOrders(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        // Slash and Cash (thanks Pf987 for this name)
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
        }
        return state;
    }
}
exports.TeamRocketsPersianex = TeamRocketsPersianex;
