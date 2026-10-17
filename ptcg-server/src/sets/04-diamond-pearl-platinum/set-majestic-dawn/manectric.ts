import { Card, ChooseCardsPrompt, GameMessage, PokemonCard, State, StateUtils, StoreLike } from '../../../game';
import { CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { DiscardCardsEffect } from '../../../game/store/effects/attack-effects';
import { Effect } from '../../../game/store/effects/effect';
import { AttackEffect } from '../../../game/store/effects/game-effects';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED } from '../../../game/store/prefabs/attack-effects';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

function* useWhirlpool(next: Function, store: StoreLike, state: State,
  effect: AttackEffect): IterableIterator<State> {

  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  // Defending Pokemon has no energy cards attached
  if (!opponent.active.cards.some(c => c.superType === SuperType.ENERGY)) {
    return state;
  }

  let flipResult = false;
  yield COIN_FLIP_PROMPT(store, state, player, result => {
    flipResult = result;
    next();
  });

  if (!flipResult) {
    return state;
  }

  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_DISCARD,
    opponent.active,
    { superType: SuperType.ENERGY },
    { min: 1, max: 1, allowCancel: false }
  ), selected => {
    cards = selected || [];
    next();
  });

  const discardEnergy = new DiscardCardsEffect(effect, cards);
  return store.reduceEffect(state, discardEnergy);
}

export class Manectric extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Electrike';
  public hp: number = 80;
  public cardType: CardType[] = [L];
  public weakness = [{ type: F, value: +20 }];
  public resistance = [{ type: M, value: -20 }];
  public retreat = [];

  public attacks = [{
    name: 'Thunder Wave',
    cost: [L],
    damage: 30,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
  },
  {
    name: 'Volt Crush',
    cost: [L, C],
    damage: 40,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, discard an Energy attached to Manectric and this attack does 40 damage plus 30 more damage.'
  }];

  public set: string = 'MD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '40';
  public name: string = 'Manectric';
  public fullName: string = 'Manectric MD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Thunder Wave
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
        }
      });
    }

    // Volt Crush
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const generator = useWhirlpool(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
