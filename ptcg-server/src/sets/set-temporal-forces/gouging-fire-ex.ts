import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, GameError, GameMessage } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';

export class GougingFireex extends PokemonCard {

  public tags = [ CardTag.POKEMON_ex, CardTag.ANCIENT ];

  public regulationMark = 'G';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIRE;

  public hp: number = 230;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Heat Blast',
      cost: [ CardType.FIRE, CardType.COLORLESS ],
      damage: 60,
      text: ''
    },
    {
      name: 'Explosive Flare',
      cost: [ CardType.FIRE, CardType.FIRE, CardType.COLORLESS ],
      damage: 260,
      text: 'This Pokémon can’t use Exploding Flare again until it leaves the Active Spot.'
    }
  ];

  public set: string = 'SV5K';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '012';

  public name: string = 'Gouging Fire ex';

  public fullName: string = 'Gouging Fire ex';

  public readonly EXPLODING_FLARE_MARKER = 'EXPLODING_FLARE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {

      const player = effect.player;

      if (player.active.cards[0] !== this) {
        player.marker.removeMarker(this.EXPLODING_FLARE_MARKER, this);
        console.log('gouging fire ex marker removed - no longer in active spot');
      }

      if (player.marker.hasMarker(this.EXPLODING_FLARE_MARKER, this)) {
        console.log('gouging fire ex attack blocked');
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      player.marker.addMarker(this.EXPLODING_FLARE_MARKER, this);
      console.log('gouging fire ex marker added');
      return state;
    }
    return state;
  }
}
