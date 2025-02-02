import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameMessage, Attack, GameLog, GameError, ChooseAttackPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { AddSpecialConditionsEffect, DealDamageEffect } from '../../game/store/effects/attack-effects';

function* useNightcap(next: Function, store: StoreLike, state: State,
  effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  const opponentBenchedPokemon = opponent.bench.map(b => b.getPokemonCard()).filter(card => card !== undefined) as PokemonCard[];
  const opponentActivePokemon: PokemonCard[] = [];

  if (opponent.active.getPokemonCard() != undefined) {
    opponentActivePokemon.push(opponent.active.getPokemonCard() as PokemonCard);
  }

  const opponentPokemon = [];
  opponentPokemon.push(...opponentActivePokemon);
  opponentPokemon.push(...opponentBenchedPokemon);

  let selected: any;
  yield store.prompt(state, new ChooseAttackPrompt(
    player.id,
    GameMessage.CHOOSE_ATTACK_TO_COPY,
    opponentPokemon,
    { allowCancel: false }
  ), result => {
    selected = result;
    next();
  });
  const attack: Attack | null = selected;

  if (attack === null) {
    return state;
  }

  store.log(state, GameLog.LOG_PLAYER_COPIES_ATTACK, {
    name: player.name,
    attack: attack.name
  });

  // Perform attack
  const attackEffect = new AttackEffect(player, opponent, attack);
  store.reduceEffect(state, attackEffect);

  if (store.hasPrompts()) {
    yield store.waitPrompt(state, () => next());
  }

  if (attackEffect.damage > 0) {
    const dealDamage = new DealDamageEffect(attackEffect, attackEffect.damage);
    state = store.reduceEffect(state, dealDamage);
  }

  return state;
}

export class Nihilego extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.PSYCHIC;
  public hp: number = 110;
  public tag = [CardTag.ULTRA_BEAST];
  public weakness = [{ type: CardType.PSYCHIC }];
  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Nightcap',
      cost: [CardType.PSYCHIC],
      damage: 0,
      text: 'You can use this attack only if your opponent has exactly 2 Prize cards remaining. Choose 1 of your opponent\'s Pokemon\'s attacks and use it as this attack.'
    },
    {
      name: 'Void Tentacles',
      cost: [CardType.PSYCHIC],
      damage: 0,
      text: 'Your opponent\'s Active Pokémon is now Confused and Poisoned.'
    },
  ];

  public set: string = 'LOT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '106';
  public name: string = 'Nihilego';
  public fullName: string = 'Nihilego LOT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (opponent.getPrizeLeft() !== 2) {
        throw new GameError(GameMessage.CANNOT_USE_ATTACK);
      }

      if (opponent.getPrizeLeft() === 2) {
        const generator = useNightcap(() => generator.next(), store, state, effect);
        return generator.next().value;
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED, SpecialCondition.POISONED]);
      store.reduceEffect(state, specialConditionEffect);
    }
    return state;
  }
}