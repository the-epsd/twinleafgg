import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, GameError, GameMessage, StateUtils, EnergyCard, PokemonCardList } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { MOVE_CARDS } from '../../game/store/prefabs/prefabs';

export class Ceruledge extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Charcadet';
  public hp: number = 140;
  public cardType: CardType = R;
  public weakness = [{ type: W }];
  public retreat = [C, C];
  public tags = [CardTag.ACE_SPEC];

  public attacks = [
    {
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
    }
  ];

  public regulationMark = 'H';
  public set: string = 'SSP';
  public name: string = 'Ceruledge';
  public fullName: string = 'Ceruledge SSP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '35';
  public text: string =
    'Discard all Special Energy from all of your opponent\'s Pokémon.';

  public readonly ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
  public readonly ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
      effect.player.marker.removeMarker(this.ATTACK_USED_MARKER, this);
      effect.player.marker.removeMarker(this.ATTACK_USED_2_MARKER, this);
      console.log('marker cleared');
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
      effect.player.marker.addMarker(this.ATTACK_USED_2_MARKER, this);
      console.log('second marker added');
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
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

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      // Check marker
      if (effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
        console.log('attack blocked');
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      effect.player.marker.addMarker(this.ATTACK_USED_MARKER, this);
      console.log('marker added');
    }

    return state;
  }
}