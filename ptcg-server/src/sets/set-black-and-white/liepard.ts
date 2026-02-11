import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { Attack } from '../../game/store/card/pokemon-types';
import { StoreLike, State, StateUtils, GameMessage, GameLog, PlayerType, SlotType, GameError } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { ChooseAttackPrompt } from '../../game/store/prompts/choose-attack-prompt';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';

function* useAssist(next: Function, store: StoreLike, state: State,
  effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  // Check if there are benched Pokémon
  const hasBenchedPokemon = player.bench.some(b => b.cards.length > 0);
  if (!hasBenchedPokemon) {
    return state;
  }

  // Choose a benched Pokémon
  let targets: any[] = [];
  yield store.prompt(state, new ChoosePokemonPrompt(
    player.id,
    GameMessage.CHOOSE_POKEMON,
    PlayerType.BOTTOM_PLAYER,
    [SlotType.BENCH],
    { allowCancel: false }
  ), results => {
    targets = results || [];
    next();
  });

  if (targets.length === 0) {
    return state;
  }

  const benchedPokemon = targets[0];
  const benchedCard = benchedPokemon.getPokemonCard();

  if (benchedCard === undefined || benchedCard.attacks.length === 0) {
    return state;
  }

  // Choose an attack from the benched Pokémon
  let selected: any;
  yield store.prompt(state, new ChooseAttackPrompt(
    player.id,
    GameMessage.CHOOSE_ATTACK_TO_COPY,
    [benchedCard],
    { allowCancel: false }
  ), result => {
    selected = result;
    next();
  });

  const attack: Attack | null = selected;

  if (attack === null) {
    return state;
  }

  if (attack.copycatAttack === true) {
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

export class Liepard extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Purrloin';
  public cardType: CardType = D;
  public hp: number = 90;
  public weakness = [{ type: F }];
  public retreat = [];

  public attacks = [
    {
      name: 'Assist',
      cost: [D],
      damage: 0,
      copycatAttack: true,
      text: 'Choose 1 of your Benched Pokémon\'s attacks and use it as this attack.'
    },
    {
      name: 'Fury Swipes',
      cost: [D, D, C],
      damage: 40,
      damageCalculation: 'x',
      text: 'Flip 3 coins. This attack does 40 damage times the number of heads.'
    }
  ];

  public set: string = 'BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '67';
  public name: string = 'Liepard';
  public fullName: string = 'Liepard BLW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const hasBenchedPokemon = player.bench.some(b => b.cards.length > 0);
      if (!hasBenchedPokemon) {
        throw new GameError(GameMessage.CANNOT_USE_ATTACK);
      }
      const generator = useAssist(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 3, results => {
        const heads = results.filter(r => r).length;
        (effect as AttackEffect).damage = 40 * heads;
      });
    }

    return state;
  }
}
