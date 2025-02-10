"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JirachiPrismStar = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class JirachiPrismStar extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.PRISM_STAR];
        this.cardType = M;
        this.hp = 80;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Wish Upon a Star',
                powerType: game_1.PowerType.ABILITY,
                exemptFromAbilityLock: true,
                text: 'If you took this Pokémon as a face-down Prize card during your turn and your Bench isn\'t full, ' +
                    'before you put it into your hand, you may put it onto your Bench and take 1 more Prize card.'
            }];
        this.attacks = [
            {
                name: 'Perish Dream',
                cost: [C, C, C],
                damage: 10,
                text: 'This Pokémon is now Asleep. At the end of your opponent\'s next turn, the Defending Pokémon will be Knocked Out.'
            },
        ];
        this.set = 'CES';
        this.setNumber = '97';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Jirachi Prism Star';
        this.fullName = 'Jirachi Prism Star CES';
        this.KNOCKOUT_MARKER = 'KNOCKOUT_MARKER';
        this.CLEAR_KNOCKOUT_MARKER = 'CLEAR_KNOCKOUT_MARKER';
        this.abilityUsed = false;
    }
    reduceEffect(store, state, effect) {
        // Ability
        if (effect instanceof game_effects_1.DrawPrizesEffect) {
            const generator = this.handlePrizeEffect(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        // Attack
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.ASLEEP]);
            // First part of the attack
            specialConditionEffect.target = effect.player.active;
            store.reduceEffect(state, specialConditionEffect);
            // Second part of the attack
            effect.player.marker.addMarker(this.KNOCKOUT_MARKER, this);
            opponent.active.marker.addMarker(this.CLEAR_KNOCKOUT_MARKER, this);
            console.log('first marker added');
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.active.marker.hasMarker(this.CLEAR_KNOCKOUT_MARKER, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            effect.player.active.damage = 999;
            effect.player.active.marker.removeMarker(this.CLEAR_KNOCKOUT_MARKER, this);
            opponent.marker.removeMarker(this.KNOCKOUT_MARKER, this);
            console.log('clear marker added');
        }
        return state;
    }
    *handlePrizeEffect(next, store, state, effect) {
        const player = effect.player;
        const prizeCard = effect.prizes.find(cardList => cardList.cards.includes(this));
        // Check if ability conditions are met
        if (!prizeCard || prefabs_1.GET_PLAYER_BENCH_SLOTS(player).length === 0 || !prizeCard.isSecret || effect.destination !== player.hand) {
            return state;
        }
        // Prevent unintended multiple uses
        if (this.abilityUsed) {
            return state;
        }
        this.abilityUsed = true;
        // Check if ability is blocked
        if (prefabs_1.IS_ABILITY_BLOCKED(store, state, player, this)) {
            return state;
        }
        // Prevent prize card from going to hand until we complete the ability flow
        effect.preventDefault = true;
        // Ask player if they want to use the ability
        let wantToUse = false;
        yield prefabs_1.CONFIRMATION_PROMPT(store, state, player, result => {
            wantToUse = result;
            next();
        }, game_1.GameMessage.WANT_TO_USE_ABILITY_FROM_PRIZES);
        // If the player declines, move the original prize card to hand
        const prizeIndex = player.prizes.findIndex(prize => prize.cards.includes(this));
        const fallback = (prizeIndex) => {
            if (prizeIndex !== -1) {
                prefabs_1.TAKE_SPECIFIC_PRIZES(store, state, player, [player.prizes[prizeIndex]], { skipReduce: true });
            }
            return;
        };
        if (!wantToUse) {
            effect.preventDefault = false;
            fallback(prizeIndex);
            return state;
        }
        // We have an all clear, so let's move the card to bench
        // (Unfortunately, we have to check this again closer to the end of the flow
        // because due to how the generator pattern works, the player could have
        // played another card to the bench)
        const emptyBenchSlots = prefabs_1.GET_PLAYER_BENCH_SLOTS(player);
        if (emptyBenchSlots.length === 0) {
            effect.preventDefault = false;
            fallback(prizeIndex);
            return state;
        }
        // Now that we've confirmed the ability is allowed, we can update the state
        // (per wording of the ability, this still counts as a prize taken even if
        // it does not go to the player's hand)
        this.abilityUsed = true;
        player.prizesTaken += 1;
        const targetSlot = emptyBenchSlots[0];
        for (const [index, prize] of player.prizes.entries()) {
            if (prize.cards.includes(this)) {
                player.prizes[index].moveTo(targetSlot);
                targetSlot.pokemonPlayedTurn = state.turn;
                break;
            }
        }
        // Handle extra prize (excluding the group this card is in)
        yield prefabs_1.TAKE_X_PRIZES(store, state, player, 1, {
            promptOptions: {
                blocked: effect.prizes.map(p => player.prizes.indexOf(p))
            }
        }, () => next());
        return state;
    }
}
exports.JirachiPrismStar = JirachiPrismStar;
