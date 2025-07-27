import { PokemonCard, Stage, CardType, State, StoreLike, PlayerType, StateUtils, ChooseAttackPrompt, GameMessage, Attack, GameLog } from '../../game';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

function* useFoulPlay(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  const pokemonCard = opponent.active.getPokemonCard();

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

export class Zoroark extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Zorua';
  public cardType: CardType = D;
  public hp: number = 120;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Mind Jack',
      cost: [D],
      damage: 30,
      damageCalculation: 'x',
      text: 'This attack does 30 damage for each of your opponent\'s Benched Pokémon.'
    },
    {
      name: 'Foul Play',
      cost: [C, C, C],
      damage: 0,
      text: 'Choose 1 of your opponent\'s Active Pokémon\'s attacks and use it as this attack.'
    }
  ];

  public regulationMark = 'I';
  public set: string = 'WHT';
  public setNumber: string = '62';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Zoroark';
  public fullName: string = 'Zoroark SV11W';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Mind Jack
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = effect.opponent;
      let benched = 0;

      opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, card => {
        if (card !== opponent.active) {
          benched++;
        }
      });

      effect.damage = benched * 30;
    }

    // Foul Play
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const generator = useFoulPlay(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
