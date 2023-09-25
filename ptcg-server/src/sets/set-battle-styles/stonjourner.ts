import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameError, GameMessage } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';


export class Stonjourner extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public tags = [ CardTag.SINGLE_STRIKE ];

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 130;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Land\'s Pulse',
      cost: [ CardType.FIGHTING, CardType.COLORLESS ],
      damage: 60,
      text: 'If a Stadium is in play, this attack does 30 more damage.'
    },
    {
      name: 'Single Strike Crush',
      cost: [ CardType.COLORLESS ],
      damage: 120,
      text: 'During your next turn, this Pokémon can\'t use Giga Hammer.'
    }
  ];

  public set: string = 'BST';

  public name: string = 'Stonjourner';

  public fullName: string = 'Stonjourner BST';

  public readonly ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
  public readonly ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.ATTACK_USED_MARKER, this);
      player.marker.removeMarker(this.ATTACK_USED_2_MARKER, this);
    }

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
      const stadiumCard = StateUtils.getStadiumCard(state);
      if (stadiumCard !== undefined) {
        effect.damage += 30;
        // Discard Stadium
        const cardList = StateUtils.findCardList(state, stadiumCard);
        const player = StateUtils.findOwner(state, cardList);
        cardList.moveTo(player.discard);
      }
      return state;
    }
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      if (player.active.cards[0] !== this) {
        player.marker.removeMarker(this.ATTACK_USED_MARKER, this);
        player.marker.removeMarker(this.ATTACK_USED_2_MARKER, this);
        console.log('removed markers because not active');
      }
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
