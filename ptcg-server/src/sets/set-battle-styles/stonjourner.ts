import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameError, GameMessage } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';


export class Stonjourner extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'E';

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
      text: 'If a Stadium is in play, this attack does 30 more damage.',
      effect: (store: StoreLike, state: State, effect: AttackEffect) =>{
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
    },
    {
      name: 'Giga Hammer',
      cost: [ CardType.FIGHTING, CardType.FIGHTING, CardType.COLORLESS ],
      damage: 120,
      text: 'During your next turn, this Pokémon can\'t use Giga Hammer.',
      effect: (store: StoreLike, state: State, effect: AttackEffect) => {
        const player = effect.player;
        if (player.active.cards[0] !== this) {
          player.attackMarker.removeMarker(this.ATTACK_USED_MARKER, this);
          player.attackMarker.removeMarker(this.ATTACK_USED_2_MARKER, this);
          console.log('removed markers because not active');
        }
        // Check marker
        if (effect.player.attackMarker.hasMarker(this.ATTACK_USED_MARKER, this)) {
          console.log('attack blocked');
          throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
        }
        effect.player.attackMarker.addMarker(this.ATTACK_USED_MARKER, this);
        console.log('marker added');
        return state;
      }
    }
  ];

  public set: string = 'BST';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '84';

  public name: string = 'Stonjourner';

  public fullName: string = 'Stonjourner BST';

  public readonly ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
  public readonly ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';

  public override reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.attackMarker.removeMarker(this.ATTACK_USED_MARKER, this);
      player.attackMarker.removeMarker(this.ATTACK_USED_2_MARKER, this);
    }

    if (effect instanceof EndTurnEffect && effect.player.attackMarker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
      effect.player.attackMarker.removeMarker(this.ATTACK_USED_MARKER, this);
      effect.player.attackMarker.removeMarker(this.ATTACK_USED_2_MARKER, this);
      console.log('marker cleared');
    }

    if (effect instanceof EndTurnEffect && effect.player.attackMarker.hasMarker(this.ATTACK_USED_MARKER, this)) {
      effect.player.attackMarker.addMarker(this.ATTACK_USED_2_MARKER, this);
      console.log('second marker added');
    }

    return super.reduceEffect(store, state, effect);
  }
}
