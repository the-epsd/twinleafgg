import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { Effect } from '../../game/store/effects/effect';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { IS_SPECIAL_ENERGY_BLOCKED, SWITCH_ACTIVE_WITH_BENCHED } from '../../game/store/prefabs/prefabs';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

function* playCard(next: Function, store: StoreLike, state: State, effect: AttachEnergyEffect): IterableIterator<State> {
  const player = effect.player;

  if (effect.player.active !== effect.target) {
    return state;
  }

  let targets: PokemonCardList[] = [];
  yield store.prompt(state, new ChoosePokemonPrompt(
    player.id,
    GameMessage.CHOOSE_POKEMON_TO_SWITCH,
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
  player.switchPokemon(targets[0]);
}

export class WarpEnergy extends EnergyCard {
  public provides: CardType[] = [CardType.COLORLESS];
  public energyType = EnergyType.SPECIAL;
  public set: string = 'SLG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '70';
  public name = 'Warp Energy';
  public fullName = 'Warp Energy SLG';

  public text =
    'This card provides [C] Energy.' +
    '\n\n' +
    'When you attach this card from your hand to your Active Pokémon, switch that Pokémon with 1 of your Benched Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttachEnergyEffect && effect.energyCard === this) {
      const player = effect.player;

      if (effect.player.active !== effect.target
        || player.bench.length <= 0
        || IS_SPECIAL_ENERGY_BLOCKED(store, state, player, this, effect.target)) {
        return state;
      }

      return SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
    }
    return state;
  }
}