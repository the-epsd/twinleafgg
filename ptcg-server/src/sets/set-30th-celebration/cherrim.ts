import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, SuperType } from '../../game/store/card/card-types';
import { PlayerType, SlotType, StoreLike, State, StateUtils, GameMessage, AttachEnergyPrompt } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

function* useEnergyGift(next: Function, store: StoreLike, state: State,
  effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  if (player.deck.cards.length === 0) {
    return state;
  }
  yield store.prompt(state, new AttachEnergyPrompt(
    player.id,
    GameMessage.ATTACH_ENERGY_TO_BENCH,
    player.deck,
    PlayerType.BOTTOM_PLAYER,
    [SlotType.BENCH, SlotType.ACTIVE],
    { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
    { allowCancel: false, min: 0, max: 2 }
  ), transfers => {
    transfers = transfers || [];
    for (const transfer of transfers) {
      const target = StateUtils.getTarget(state, player, transfer.to);
      player.deck.moveCardTo(transfer.card, target);
    }
    next();
  });
  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class Cherrim extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Cherubi';
  public hp: number = 80;
  public cardType: CardType = G;
  public weakness = [{ type: R }];
  public retreat = [C];
  public attacks = [{
    name: 'Energy Gift',
    cost: [C],
    damage: 0,
    text: 'Search your deck for 2 Basic Energy and attach them to your Pokémon in any way you like. Then, shuffle your deck.'
  },
  {
    name: 'Leafage',
    cost: [G, C],
    damage: 50,
    text: ''
  }];
  public regulationMark: string = 'J';
  public set: string = 'MF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '3';
  public name: string = 'Cherrim';
  public fullName: string = 'Cherrim MF';
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-black-bolt-white-flare/whimsicott-ex.ts (Energy Gift — attach Basic Energy from deck)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const generator = useEnergyGift(() => generator.next(), store, state, effect);
      return generator.next().value;
    }
    return state;
  }
}
