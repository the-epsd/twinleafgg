import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, Attack, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Koraidon extends PokemonCard {

  public tags = [CardTag.ANCIENT];

  public regulationMark = 'H';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = F;

  public hp: number = 130;

  public retreat = [C, C];

  public weakness = [{ type: P }];

  public attacks = [
    {
      name: 'Unrelenting Onslaught',
      cost: [C, C],
      damage: 30,
      damageCalculator: '+',
      text: 'If 1 of your other Ancient Pokémon used an attack during your last turn, this attack does 150 more damage.'
    },
    {
      name: 'Hammer In',
      cost: [F, F, C],
      damage: 110,
      text: ''
    }
  ];

  public set: string = 'SSP';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '116';

  public name: string = 'Koraidon';

  public fullName: string = 'Koraidon SSP';

  public readonly UNRELENTING_ONSLAUGHT_MARKER = 'UNRELENTING_ONSLAUGHT_MARKER';
  public readonly UNRELENTING_ONSLAUGHT_2_MARKER = 'UNRELENTING_ONSLAUGHT_2_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      effect.player.marker.removeMarker(this.UNRELENTING_ONSLAUGHT_MARKER, this);
      console.log('marker removed');
      effect.player.marker.removeMarker(this.UNRELENTING_ONSLAUGHT_2_MARKER, this);
      console.log('marker 2 removed');
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.UNRELENTING_ONSLAUGHT_2_MARKER, this)) {
      effect.player.marker.removeMarker(this.UNRELENTING_ONSLAUGHT_MARKER, this);
      effect.player.marker.removeMarker(this.UNRELENTING_ONSLAUGHT_2_MARKER, this);
      console.log('marker cleared');
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.UNRELENTING_ONSLAUGHT_MARKER, this)) {
      effect.player.marker.addMarker(this.UNRELENTING_ONSLAUGHT_2_MARKER, this);
      console.log('second marker added');
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const playerLastAttack = state.playerLastAttack?.[player.id];
      const originalCard = playerLastAttack ? this.findOriginalCard(state, playerLastAttack) : null;

      if (originalCard && originalCard.tags.includes(CardTag.ANCIENT) && !player.marker.hasMarker(this.UNRELENTING_ONSLAUGHT_MARKER)) {
        effect.damage += 150;
        console.log('marker added');
      }
      player.marker.addMarker(this.UNRELENTING_ONSLAUGHT_MARKER, this);
    }
    return state;
  }

  private findOriginalCard(state: State, playerLastAttack: Attack): PokemonCard | null {
    let originalCard: PokemonCard | null = null;

    state.players.forEach(player => {
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card.attacks.some(attack => attack === playerLastAttack)) {
          originalCard = card;
        }
      });

      // Check deck, discard, hand, and lost zone
      [player.deck, player.discard, player.hand, player.lostzone].forEach(cardList => {
        cardList.cards.forEach(card => {
          if (card instanceof PokemonCard && card.attacks.some(attack => attack === playerLastAttack)) {
            originalCard = card;
          }
        });
      });
    });

    return originalCard;
  }
}