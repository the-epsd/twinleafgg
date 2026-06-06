import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, Attack, ChooseAttackPrompt, GameLog, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

function* useMetronome(next: Function, store: StoreLike, state: State,
  effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  const pokemonCard = opponent.active.getPokemonCard();

  let retryCount = 0;
  const maxRetries = 3;

  if (pokemonCard === undefined || pokemonCard.attacks.length === 0) {
    return state;
  }

  let selected: any;
  yield store.prompt(state, new ChooseAttackPrompt(
    player.id,
    GameMessage.CHOOSE_ATTACK_TO_COPY,
    [pokemonCard],
    { allowCancel: false }
  ), result => {
    selected = result;
    next();
  });

  const attack: Attack | null = selected;

  if (attack === null) {
    return state; // Player chose to cancel
  }

  try {
    store.log(state, GameLog.LOG_PLAYER_COPIES_ATTACK, {
      name: player.name,
      attack: attack.name
    });

    const attackEffect = new AttackEffect(player, opponent, attack);
    state = store.reduceEffect(state, attackEffect);

    if (store.hasPrompts()) {
      yield store.waitPrompt(state, () => next());
    }

    if (attackEffect.damage > 0) {
      const dealDamage = new DealDamageEffect(attackEffect, attackEffect.damage);
      state = store.reduceEffect(state, dealDamage);
    }

    return state; // Successfully executed attack, exit the function
  } catch (error) {
    retryCount++;
    if (retryCount >= maxRetries) {
      return state;
    }
  }
}

export class Clefable extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Clefairy';

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 70;

  public weakness = [{ type: CardType.FIGHTING }];

  public resistance = [{ type: CardType.PSYCHIC, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Metronome',
      cost: [CardType.COLORLESS],
      damage: 0,
      text: 'Choose 1 of the Defending Pokémon\'s attacks. Metronome copies that attack except for its Energy costs and anything else required in order to use that attack, such as discarding Energy cards. (No matter what type the Defending Pokémon is, Clefable\'s type is still Colorless.)'
    },
    {
      name: 'Minimize',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 0,
      text: 'All damage done by attacks to Clefable during your opponent\'s next turn is reduced by 20 (after applying Weakness and Resistance).'
    },
  ];

  public set: string = 'JU';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '1';

  public name: string = 'Clefable';

  public fullName: string = 'Clefable JU';
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const generator = useMetronome(() => generator.next(), store, state, effect);
      return generator.next().value;
    }
    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.player.active.damageReductionNextTurn = 20;
    }

    return state;
  }
}

