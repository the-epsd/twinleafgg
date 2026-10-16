import { AttachEnergyPrompt, GameError, GameMessage, PlayerType, PokemonCard, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { CardType, EnergyType, Stage, SuperType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, MOVE_CARDS, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED } from '../../../game/store/prefabs/attack-effects';

export class Grotle extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Turtwig';
  public hp: number = 90;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R, value: +20 }];
  public resistance = [{ type: W, value: -20 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Planting',
    cost: [C],
    damage: 20,
    text: 'Attach a Grass Energy card from your hand to 1 of your Pokémon.'
  },
  {
    name: 'Body Slam',
    cost: [G, G, C],
    damage: 40,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
  }];

  public set: string = 'MD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '37';
  public name: string = 'Grotle';
  public fullName: string = 'Grotle MD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Planting
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const hasEnergyInHand = player.hand.cards.some(c => {
      return c.superType === SuperType.ENERGY && c.energyType === EnergyType.BASIC;
      });
      if (!hasEnergyInHand) {
      throw new GameError(GameMessage.CANNOT_USE_ATTACK);
      }
      return store.prompt(state, new AttachEnergyPrompt(
      player.id,
      GameMessage.ATTACH_ENERGY_TO_BENCH,
      player.hand,
      PlayerType.BOTTOM_PLAYER,
      [SlotType.ACTIVE, SlotType.BENCH],
      { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
      { allowCancel: false, min: 1, max: 1 }
      ), transfers => {
      transfers = transfers || [];
      // cancelled by user
      if (transfers.length === 0) {
      return;
      }
      for (const transfer of transfers) {
      const target = StateUtils.getTarget(state, player, transfer.to);
      MOVE_CARDS(store, state, player.hand, target, { cards: [transfer.card], sourceCard: this });
      }
      });
    }

    // Body Slam
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
        }
      });
    }

    return state;
  }
}
