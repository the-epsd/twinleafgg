import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, GameMessage, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, DrawPrizesEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { CONFIRMATION_PROMPT, GET_PLAYER_BENCH_SLOTS, IS_ABILITY_BLOCKED, TAKE_SPECIFIC_PRIZES, TAKE_X_PRIZES } from '../../game/store/prefabs/prefabs';

export class JirachiPrismStar extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public tags: string[] = [CardTag.PRISM_STAR];

  public cardType: CardType = M;

  public hp: number = 80;

  public weakness = [{ type: R }];

  public resistance = [{ type: P, value: -20 }];

  public retreat = [C];

  public powers = [{
    name: 'Wish Upon a Star',
    powerType: PowerType.ABILITY,
    exemptFromAbilityLock: true,
    text: 'If you took this Pokémon as a face-down Prize card during your turn and your Bench isn\'t full, ' +
    'before you put it into your hand, you may put it onto your Bench and take 1 more Prize card.'
  }];

  public attacks = [
    {
      name: 'Perish Dream',
      cost: [C, C, C],
      damage: 10,
      text: 'This Pokémon is now Asleep. At the end of your opponent\'s next turn, the Defending Pokémon will be Knocked Out.'
    },
  ];

  public set: string = 'CES';

  public setNumber: string = '97';

  public cardImage: string = 'assets/cardback.png';

  public name: string = 'Jirachi Prism Star';

  public fullName: string = 'Jirachi Prism Star CES';

  public readonly KNOCKOUT_MARKER = 'KNOCKOUT_MARKER';
  public readonly CLEAR_KNOCKOUT_MARKER = 'CLEAR_KNOCKOUT_MARKER';

  public abilityUsed = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ability
    if (effect instanceof DrawPrizesEffect) {
      const generator = this.handlePrizeEffect(
        () => generator.next(),
        store, 
        state, 
        effect
      );
      return generator.next().value;
    }
    
    // Attack
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);

      // First part of the attack
      specialConditionEffect.target = effect.player.active;
      store.reduceEffect(state, specialConditionEffect);

      // Second part of the attack
      effect.player.marker.addMarker(this.KNOCKOUT_MARKER, this);
      opponent.active.marker.addMarker(this.CLEAR_KNOCKOUT_MARKER, this);
      console.log('first marker added');
    }

    if (effect instanceof EndTurnEffect && effect.player.active.marker.hasMarker(this.CLEAR_KNOCKOUT_MARKER, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      effect.player.active.damage = 999;
      effect.player.active.marker.removeMarker(this.CLEAR_KNOCKOUT_MARKER, this);
      opponent.marker.removeMarker(this.KNOCKOUT_MARKER, this);
      console.log('clear marker added');
    }

    return state;
  }

  private *handlePrizeEffect(next: Function, store: StoreLike, state: State, effect: DrawPrizesEffect): IterableIterator<State> {
    const player = effect.player;
    const prizeCard = effect.prizes.find(cardList => cardList.cards.includes(this));

    // Check if ability conditions are met
    if (!prizeCard || GET_PLAYER_BENCH_SLOTS(player).length === 0 || !prizeCard.isSecret || effect.destination !== player.hand) {
      return state;
    }

    // Prevent unintended multiple uses
    if (this.abilityUsed) {
      return state;
    }
    this.abilityUsed = true;

    // Check if ability is blocked
    if (IS_ABILITY_BLOCKED(store, state, player, this)) {
      return state;
    }

    // Prevent prize card from going to hand until we complete the ability flow
    effect.preventDefault = true;

    // Ask player if they want to use the ability
    let wantToUse = false;
    yield CONFIRMATION_PROMPT(store, state, player, result => {
      wantToUse = result;
      next();
    }, GameMessage.WANT_TO_USE_ABILITY_FROM_PRIZES);

    // If the player declines, move the original prize card to hand
    const prizeIndex = player.prizes.findIndex(prize => prize.cards.includes(this));
    const fallback: (prizeIndex: number) => void = (prizeIndex) => {
      if (prizeIndex !== -1) {
        TAKE_SPECIFIC_PRIZES(store, state, player, [player.prizes[prizeIndex]], { skipReduce: true });
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
    const emptyBenchSlots = GET_PLAYER_BENCH_SLOTS(player);
    
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
    yield TAKE_X_PRIZES(store, state, player, 1, {
      promptOptions: {
        blocked: effect.prizes.map(p => player.prizes.indexOf(p))
      }
    }, () => next());

    return state;
  }
}