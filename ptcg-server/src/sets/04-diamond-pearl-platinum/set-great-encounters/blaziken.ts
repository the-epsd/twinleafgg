import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, EnergyType, Stage, SuperType } from '../../../game/store/card/card-types';
import { AttachEnergyPrompt, EnergyCard, GameMessage, PlayerType, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../../game/store/prefabs/costs';
import { MOVE_CARDS, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON } from '../../../game/store/prefabs/attack-effects';

export class Blaziken extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Combusken';
  public hp: number = 130;
  public cardType: CardType[] = [R];
  public weakness = [{ type: W, value: +30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Fire Dance',
    cost: [C],
    damage: 30,
    text: 'Search your discard pile for a Fire Energy card and attach it to 1 of your Pokémon.'
  },
  {
    name: 'Flame Kick',
    cost: [R, R, C],
    damage: 0,
    text: 'Discard 2 Fire Energy attached to Blaziken. This attack does 80 damage to 1 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '1';
  public name: string = 'Blaziken';
  public fullName: string = 'Blaziken GE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Fire Dance
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const hasEnergyInDiscard = player.discard.cards.some(c =>
        c instanceof EnergyCard &&
        c.energyType === EnergyType.BASIC &&
        c.provides.includes(CardType.FIRE)
      );
      if (!hasEnergyInDiscard) {
        return state;
      }
      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_CARDS,
        player.discard,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Fire Energy' },
        { allowCancel: true, min: 0, max: 1 }
      ), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          MOVE_CARDS(store, state, player.discard, target, {
            cards: [transfer.card],
            sourceCard: this,
            sourceEffect: this.attacks[0],
          });
        }
      });
    }

    // Flame Kick
    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 2, CardType.FIRE);
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(80, effect, store, state);
    }

    return state;
  }
}
