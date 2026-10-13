import { ChoosePokemonPrompt, GameMessage, PlayerType, PokemonCard, PowerType, SlotType, State, StoreLike } from '../../../game';
import { CardTag, CardType, SpecialCondition, Stage } from '../../../game/store/card/card-types';
import { AddSpecialConditionsEffect } from '../../../game/store/effects/attack-effects';
import { Effect } from '../../../game/store/effects/effect';
import { PlaceDamageCountersEffect } from '../../../game/store/effects/game-effects';
import { PlayPokemonEffect } from '../../../game/store/effects/play-card-effects';
import { IS_POKEPOWER_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

function* useFlashBite(
  next: Function,
  store: StoreLike,
  state: State,
  effect: PlayPokemonEffect,
): IterableIterator<State> {
  const player = effect.player;

  yield store.prompt(
    state,
    new ChoosePokemonPrompt(
      player.id,
      GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
      PlayerType.TOP_PLAYER,
      [SlotType.ACTIVE, SlotType.BENCH],
      { allowCancel: true },
    ),
    (selected) => {
      if (!selected || selected.length === 0) {
        return state;
      }

      const target = selected[0];
      store.reduceEffect(
        state,
        new PlaceDamageCountersEffect(player, target, 10, effect.pokemonCard, effect.pokemonCard.powers[0]),
      );
      next();
    },
  );

  return state;
}

export class CrobatG extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  protected _tags = [CardTag.POKEMON_SP];
  public cardType: CardType[] = [P];
  public hp: number = 80;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [];

  public powers = [{
    name: 'Flash Bite',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn, when you put Crobat G from your hand onto your Bench, you may put 1 damage counter on 1 of your opponent\'s Pokémon.'
  }];

  public attacks = [{
    name: 'Toxic Fang',
    cost: [P, C],
    damage: 0,
    text: 'The Defending Pokémon is now Poisoned. Put 2 damage counters instead of 1 on the Defending Pokémon between turns.'
  }];

  public set: string = 'PL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '47';
  public name: string = 'Crobat G';
  public fullName: string = 'Crobat G PL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Flash Bite
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      if (IS_POKEPOWER_BLOCKED(store, state, effect.player, this)) {
        return state;
      }

      const generator = useFlashBite(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    // Toxic Fang
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
      specialCondition.poisonDamage = 20;
      store.reduceEffect(state, specialCondition);
    }

    return state;
  }
}
