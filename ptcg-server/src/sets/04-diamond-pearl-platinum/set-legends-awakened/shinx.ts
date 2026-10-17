import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, EnergyType, Stage, SuperType } from '../../../game/store/card/card-types';
import { PlayerType, SlotType, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { ATTACH_ENERGY_PROMPT, MULTIPLE_COIN_FLIPS_PROMPT, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Shinx extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType[] = [L];
  public weakness = [{ type: F, value: +10 }];
  public resistance = [{ type: M, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Recharge',
    cost: [C],
    damage: 0,
    text: 'Search your deck for a Lightning Energy card attach it to Shinx. Shuffle your deck afterward.'
  },
  {
    name: 'Double Kick',
    cost: [L, C],
    damage: 20,
    damageCalculation: 'x',
    text: 'Flip 2 coins. This attack does 20 damage times the number of heads.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '118';
  public name: string = 'Shinx';
  public fullName: string = 'Shinx LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Recharge
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const hasLightning = player.deck.cards.some(c => c.name === 'Lightning Energy');
      if (!hasLightning) {
        return state;
      }
      state = ATTACH_ENERGY_PROMPT(
        store,
        state,
        player,
        PlayerType.BOTTOM_PLAYER,
        SlotType.DECK,
        [SlotType.ACTIVE],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Lightning Energy' },
        { min: 1, max: 1, allowCancel: false }
      );
      return SHUFFLE_DECK(store, state, player);
    }

    // Double Kick
    if (WAS_ATTACK_USED(effect, 1, this)) {
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, results => {
        const heads = results.filter(r => r).length;
        effect.damage = 20 * heads;
      });
    }

    return state;
  }
}
