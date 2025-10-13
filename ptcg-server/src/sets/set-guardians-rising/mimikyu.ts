import { CardType, PokemonCard, Stage, State, StoreLike, StateUtils, GameLog } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { AfterAttackEffect } from '../../game/store/effects/game-phase-effects';

function* useCopycat(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  // Get opponent's last attack info
  const lastAttackInfo = state.playerLastAttack[opponent.id];

  if (!lastAttackInfo) {
    return state;
  }

  const { attack: lastAttack, sourceCard } = lastAttackInfo;

  // Validate attack is copyable
  if (lastAttack.copycatAttack === true || lastAttack.gxAttack === true) {
    return state;
  }

  store.log(state, GameLog.LOG_PLAYER_COPIES_ATTACK, {
    name: player.name,
    attack: lastAttack.name
  });

  // Create AttackEffect with Mimikyu as the attacker
  const copiedAttackEffect = new AttackEffect(player, opponent, lastAttack);
  copiedAttackEffect.source = player.active;
  copiedAttackEffect.target = opponent.active;

  // CRITICAL: Call the source card's reduceEffect directly
  // This ensures the attack logic runs even if the card is not in play
  state = sourceCard.reduceEffect(store, state, copiedAttackEffect);

  // Handle any prompts from the attack
  if (store.hasPrompts()) {
    yield store.waitPrompt(state, () => next());
  }

  // Deal damage if applicable and not already handled
  if (copiedAttackEffect.damage > 0) {
    const dealDamage = new DealDamageEffect(copiedAttackEffect, copiedAttackEffect.damage);
    state = store.reduceEffect(state, dealDamage);
  }

  // Create and process AfterAttackEffect (this is what triggers after-attack effects)
  const afterAttackEffect = new AfterAttackEffect(player, opponent, lastAttack);
  state = store.reduceEffect(state, afterAttackEffect);

  // Handle any prompts from the after-attack effect
  if (store.hasPrompts()) {
    yield store.waitPrompt(state, () => next());
  }

  return state;
}

export class Mimikyu extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 70;

  public weakness = [];

  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Filch',
    cost: [CardType.COLORLESS],
    damage: 0,
    text: 'Draw 2 cards.'
  }, {
    name: 'Copycat',
    cost: [CardType.PSYCHIC, CardType.COLORLESS],
    damage: 0,
    copycatAttack: true,
    text: 'If your opponent\'s Pokémon used an attack that isn\'t a GX attack during their last turn, use it as this attack.'
  }];

  public set: string = 'GRI';

  public name: string = 'Mimikyu';

  public fullName: string = 'Mimikyu GRI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '58';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // if (effect instanceof EndTurnEffect) {
    //   // Only clear the copied reduceEffect when it's our turn ending
    //   const cardList = StateUtils.findCardList(state, this);
    //   const owner = StateUtils.findOwner(state, cardList);
    //   if (owner === effect.player) {
    //     console.log('Clearing copied reduceEffect and properties for Mimikyu');
    //     // Remove copiedReduceEffect and copiedProperties fields and logic
    //   }
    //   return state;
    // }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      player.deck.moveTo(player.hand, 2);
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const generator = useCopycat(() => generator.next(), store, state, effect);
      return generator.next().value;
    }
    return state;
  }
}