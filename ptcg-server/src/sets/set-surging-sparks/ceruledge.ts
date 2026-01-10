import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, EnergyCard, PokemonCardList } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { MOVE_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Ceruledge extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Charcadet';
  public hp: number = 140;
  public cardType: CardType = R;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Blaze Curse',
    cost: [C],
    damage: 0,
    text: 'Discard all Special Energy from each of your opponent\'s Pokémon.'
  },
  {
    name: 'Amethyst Rage',
    cost: [R, R, C],
    damage: 160,
    text: 'During your next turn, this Pokémon can\'t attack..'
  }];

  public regulationMark = 'H';
  public set: string = 'SSP';
  public name: string = 'Ceruledge';
  public fullName: string = 'Ceruledge SSP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '35';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Function to discard special energy and tools from a PokemonCardList
      const discardSpecialEnergy = (pokemonCardList: PokemonCardList) => {
        const cardsToDiscard = pokemonCardList.cards.filter(card =>
          (card instanceof EnergyCard && card.energyType === EnergyType.SPECIAL)
        );
        if (cardsToDiscard.length > 0) {
          state = MOVE_CARDS(store, state, pokemonCardList, opponent.discard, { cards: cardsToDiscard });
        }
      };

      // Discard from active Pokémon
      discardSpecialEnergy(opponent.active);

      // Discard from bench Pokémon
      opponent.bench.forEach(benchPokemon => {
        discardSpecialEnergy(benchPokemon);
      });
    }

    // Amethyst Rage
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      player.active.cannotAttackNextTurnPending = true;
    }

    return state;
  }
}