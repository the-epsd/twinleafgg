import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT, SEARCH_DECK_FOR_CARDS_TO_HAND } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED } from '../../game/store/prefabs/attack-effects';

export class Pachirisu extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 70;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Minor Errand-Running',
      cost: [C],
      damage: 0,
      text: 'Search your deck for 2 basic Energy cards, reveal them, and put them into your hand. Shuffle your deck afterward.'
    },
    {
      name: 'Electric Tail',
      cost: [L],
      damage: 10,
      text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
    }
  ];

  public set: string = 'PLF';
  public setNumber: string = '37';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Pachirisu';
  public fullName: string = 'Pachirisu PLF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const blocked: number[] = [];
      player.deck.cards.forEach((card, index) => {
        if (!(card.superType === SuperType.ENERGY && (card as any).energyType === EnergyType.BASIC)) {
          blocked.push(index);
        }
      });

      SEARCH_DECK_FOR_CARDS_TO_HAND(
        store, state, player, this,
        { superType: SuperType.ENERGY },
        { min: 0, max: 2, allowCancel: true, blocked },
        this.attacks[0]
      );
    }

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
