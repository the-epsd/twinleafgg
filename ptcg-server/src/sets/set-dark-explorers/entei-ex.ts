import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType, EnergyType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, EnergyCard, AttachEnergyPrompt, PlayerType, SlotType, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, MOVE_CARDS } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED } from '../../game/store/prefabs/attack-effects';

export class EnteiEx extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_EX];
  public cardType: CardType = R;
  public hp: number = 180;
  public weakness = [{ type: W }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Fire Fang',
      cost: [R, C],
      damage: 30,
      text: 'The Defending Pokemon is now Burned.'
    },
    {
      name: 'Grand Flame',
      cost: [R, R, C],
      damage: 90,
      text: 'Attach a Fire Energy card from your discard pile to 1 of your Benched Pokemon.'
    }
  ];

  public set: string = 'DEX';
  public setNumber: string = '13';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Entei-EX';
  public fullName: string = 'Entei EX DEX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Fire Fang - applies burn
    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED(store, state, effect);
    }

    // Grand Flame - attach Fire Energy from discard to a benched Pokemon
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      // Check if there's Fire Energy in discard
      const hasFireEnergyInDiscard = player.discard.cards.some(c => {
        return c instanceof EnergyCard && c.name === 'Fire Energy';
      });

      // Check if there are any benched Pokemon
      const hasBenchedPokemon = player.bench.some(b => b.cards.length > 0);

      if (!hasFireEnergyInDiscard || !hasBenchedPokemon) {
        return state;
      }

      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_BENCH,
        player.discard,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Fire Energy' },
        { allowCancel: false, min: 1, max: 1 }
      ), transfers => {
        transfers = transfers || [];
        if (transfers.length === 0) {
          return;
        }
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          MOVE_CARDS(store, state, player.discard, target, { cards: [transfer.card] });
        }
      });
    }

    return state;
  }
}
