import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { StateUtils } from '../../game/store/state-utils';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { DamageMap } from '../../game/store/prompts/move-damage-prompt';
import { GameMessage } from '../../game/game-message';
import { PutCountersEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { PutDamagePrompt } from '../..';


function* usePhantomDive(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  const hasBenched = opponent.bench.some(b => b.cards.length > 0);
  if (!hasBenched) {
    return state;
  }

  const maxAllowedDamage: DamageMap[] = [];
  opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
    maxAllowedDamage.push({ target, damage: card.hp + 60 });
  });

  const damage = 60;

  return store.prompt(state, new PutDamagePrompt(
    effect.player.id,
    GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
    PlayerType.TOP_PLAYER,
    [SlotType.BENCH],
    damage,
    maxAllowedDamage,
    { allowCancel: false }
  ), targets => {
    const results = targets || [];
    for (const result of results) {
      const target = StateUtils.getTarget(state, player, result.target);
      const putCountersEffect = new PutCountersEffect(effect, result.damage);
      putCountersEffect.target = target;
      store.reduceEffect(state, putCountersEffect);
    }
  });
}

export class Dragapultex extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public tags = [CardTag.POKEMON_ex, CardTag.POKEMON_TERA];

  public evolvesFrom = 'Drakloak';

  public regulationMark = 'H';

  public cardType: CardType = CardType.DRAGON;

  public hp: number = 320;

  public weakness = [];

  public resistance = [];

  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Jet Headbutt',
    cost: [CardType.COLORLESS],
    damage: 70,
    text: ''
  }, {
    name: 'Phantom Dive',
    cost: [CardType.FIRE, CardType.PSYCHIC],
    damage: 200,
    text: 'Put 6 damage counters on your opponent\'s Benched Pokemon in any way you like.'
  }];

  public set: string = 'TWM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '130';

  public name: string = 'Dragapult ex';

  public fullName: string = 'Dragapult ex TWM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const generator = usePhantomDive(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    if (effect instanceof PutDamageEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Target is not Active
      if (effect.target === player.active || effect.target === opponent.active) {
        return state;
      }

      // Target is this Pokemon
      if (effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
        effect.preventDefault = true;
      }
    }
    return state;
  }
}