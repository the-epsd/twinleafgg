import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, EnergyType, Stage } from '../../../game/store/card/card-types';
import { EnergyCard, State, StoreLike, pokemonHasCardType } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { SEARCH_DECK_FOR_CARDS_TO_HAND, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Heatmor extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 120;
  public cardType: CardType[] = [R];
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Licking Catch',
    cost: [R],
    damage: 0,
    text: 'Search your deck for up to 3 in any combination of Fire Pokémon and Basic Fire Energy cards, reveal them, and put them into your hand. Then, shuffle your deck.',
  }, {
    name: 'Fire Claws',
    cost: [R, R],
    damage: 60,
    text: '',
  }];

  public regulationMark = 'I';
  public set: string = 'WHT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '19';
  public name: string = 'Heatmor';
  public fullName: string = 'Heatmor WHT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Licking Catch
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const blocked: number[] = [];
      player.deck.cards.forEach((c, index) => {
        const isFirePokemon = c instanceof PokemonCard && pokemonHasCardType(c, CardType.FIRE);
        const isBasicFireEnergy =
          c instanceof EnergyCard &&
          c.energyType === EnergyType.BASIC &&
          c.provides.includes(CardType.FIRE);
        if (!isFirePokemon && !isBasicFireEnergy) {
          blocked.push(index);
        }
      });
      SEARCH_DECK_FOR_CARDS_TO_HAND(
        store,
        state,
        effect.player,
        this,
        {},
        {
          min: 0,
          max: 3,
          allowCancel: false,
          blocked,
        },
        this.attacks[0],
      );
    }

    return state;
  }
}
