import { DamageMap, GameError, GameMessage, PlayerType, PutDamagePrompt, SlotType, StateUtils } from '../../game';
import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect } from '../../game/store/effects/game-effects';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

function* usePotion(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;

  const maxAllowedHealing: DamageMap[] = [];

  const healingLeft = 0;
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
    maxAllowedHealing.push({ target, damage: cardList.damage });
  });

  const healing = Math.min(20, healingLeft);

  if (maxAllowedHealing.filter(m => m.damage > 0).length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  return store.prompt(state, new PutDamagePrompt(
    effect.player.id,
    GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
    PlayerType.TOP_PLAYER,
    [SlotType.ACTIVE, SlotType.BENCH],
    healing,
    maxAllowedHealing,
    { allowCancel: false }
  ), targets => {
    const results = targets || [];
    for (const result of results) {
      const target = StateUtils.getTarget(state, player, result.target);
      const healEffect = new HealEffect(effect.player, target, result.damage);
      healEffect.target = target;
      store.reduceEffect(state, healEffect);
    }
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
  });
}

export class Potion extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BS'; // Replace with the appropriate set abbreviation

  public name: string = 'Potion';

  public fullName: string = 'Potion BS'; // Replace with the appropriate set abbreviation

  public cardImage: string = 'assets/cardback.png'; // Replace with the appropriate card image path

  public setNumber: string = '94'; // Replace with the appropriate set number

  public text: string = 'Remove up to 2 damage counters from 1 of your Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = usePotion(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
