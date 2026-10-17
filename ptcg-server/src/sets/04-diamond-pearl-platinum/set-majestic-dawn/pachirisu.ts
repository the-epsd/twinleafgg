import { PokemonCard, State, StoreLike } from '../../../game';
import { CardType, EnergyType, Stage, SuperType } from '../../../game/store/card/card-types';
import { EnergyCard } from '../../../game/store/card/energy-card';
import { Effect } from '../../../game/store/effects/effect';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED } from '../../../game/store/prefabs/attack-effects';
import { COIN_FLIP_PROMPT, SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Pachirisu extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType[] = [L];
  public weakness = [{ type: F, value: +20 }];
  public resistance = [{ type: M, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Trans Tail',
    cost: [],
    damage: 0,
    text: 'Search your discard pile for a Lightning Energy card, show it to your opponent, and put it into your hand.'
  },
  {
    name: 'Thundershock',
    cost: [L, C],
    damage: 30,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
  }];

  public set: string = 'MD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '43';
  public name: string = 'Pachirisu';
  public fullName: string = 'Pachirisu MD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Trans Tail
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const hasLightning = player.discard.cards.some(c =>
        c instanceof EnergyCard
        && c.energyType === EnergyType.BASIC
        && c.provides.includes(CardType.LIGHTNING)
      );
      if (!hasLightning) {
        return state;
      }
      SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND(
        store,
        state,
        player,
        this,
        { superType: SuperType.ENERGY, name: 'Lightning Energy' },
        { min: 1, max: 1, allowCancel: false },
        effect,
      );
    }

    // Thundershock
    if (WAS_ATTACK_USED(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
        }
      });
    }

    return state;
  }
}
