import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameMessage, ChooseAttackPrompt, GameLog } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { ApplyWeaknessEffect, AfterDamageEffect, DealDamageEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

function* useCrossFusionStrike(next: Function, store: StoreLike, state: State,
  effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  const benched = player.bench.filter(b =>
    b.cards.length > 0 &&
    b.getPokemonCard()?.tags.includes(CardTag.FUSION_STRIKE)
  );
  const fusionStrike = benched.map(b => b.getPokemonCard()).filter((c): c is PokemonCard => c !== undefined);

  if (fusionStrike.length === 0) {
    return state;
  }

  let selected: any;
  yield store.prompt(state, new ChooseAttackPrompt(
    player.id,
    GameMessage.CHOOSE_ATTACK_TO_COPY,
    fusionStrike,
    { allowCancel: false }
  ), result => {
    selected = result;
    next();
  });

  if (!selected || selected.copycatAttack) {
    return state;
  }

  store.log(state, GameLog.LOG_PLAYER_COPIES_ATTACK, {
    name: player.name,
    attack: selected.name
  });

  // Perform attack
  const attackEffect = new AttackEffect(player, opponent, selected);
  state = store.reduceEffect(state, attackEffect);

  if (store.hasPrompts()) {
    yield store.waitPrompt(state, () => next());
  }

  if (attackEffect.damage > 0) {
    const dealDamage = new DealDamageEffect(attackEffect, attackEffect.damage);
    state = store.reduceEffect(state, dealDamage);
  }

  return state;
}

export class MewVMAX extends PokemonCard {
  public tags = [CardTag.POKEMON_VMAX, CardTag.FUSION_STRIKE];
  public stage: Stage = Stage.VMAX;
  public evolvesFrom = 'Mew V';
  public cardType: CardType = P;
  public hp: number = 310;
  public weakness = [{ type: D }];
  public retreat = [];

  public attacks = [{
    name: 'Cross Fusion Strike',
    cost: [C, C],
    copycatAttack: true,
    damage: 0,
    text: 'Choose 1 of your Benched Fusion Strike Pokémon\'s attacks and use it as this attack.'
  },
  {
    name: 'Max Miracle',
    cost: [P, P],
    damage: 130,
    shredAttack: true,
    text: 'This attack\'s damage isn\'t affected by any effects on your opponent\'s Active Pokémon.'
  }];

  public regulationMark = 'E';
  public set: string = 'FST';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '114';
  public name: string = 'Mew VMAX';
  public fullName: string = 'Mew VMAX FST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const applyWeakness = new ApplyWeaknessEffect(effect, 130);
      store.reduceEffect(state, applyWeakness);
      const damage = applyWeakness.damage;

      effect.damage = 0;

      if (damage > 0) {
        opponent.active.damage += damage;
        const afterDamage = new AfterDamageEffect(effect, damage);
        state = store.reduceEffect(state, afterDamage);
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const generator = useCrossFusionStrike(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}