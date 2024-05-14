import { CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { GamePhase, State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PlayerType, PokemonCard, PowerType, StateUtils } from '../../game';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Froslass extends PokemonCard {
  
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom: string = 'Snorunt';

  public regulationMark = 'H';
  
  public cardType: CardType = CardType.WATER;
  
  public weakness = [{ type: CardType.METAL }];

  public hp: number = 90;
  
  public retreat = [ CardType.COLORLESS ];
  
  public powers = [{
    name: 'Chilling Curtain',
    powerType: PowerType.ABILITY,
    text: 'During Pokémon Checkup, put 1 damage counter on each Pokémon in play that has any Abilities (excluding any Froslass).'
  }];

  public attacks = [
    {
      name: 'Frost Smash',
      cost: [CardType.WATER, CardType.COLORLESS ],
      damage: 60,
      text: ''
    }
  ];
  
  public set: string = 'SV6';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '33';
  
  public name: string = 'Froslass';
  
  public fullName: string = 'Froslass SV6';

  public CHILLING_CURTAIN_MARKER = 'CHILLING_CURTAIN_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0] && !effect.player.marker.hasMarker(this.CHILLING_CURTAIN_MARKER, this)) {
      if (state.phase === GamePhase.BETWEEN_TURNS) {

        const player = effect.player;

        try {
          const powerEffect = new PowerEffect(player, this.powers[0], this);
          store.reduceEffect(state, powerEffect);
        } catch {
          return state;
        }

        const opponent = StateUtils.getOpponent(state, player);

        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
          if (card.powers.length > 0 && card.name !== 'Froslass') {
            cardList.damage += 10;
          }
        });

        opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
          if (card.name !== 'Froslass' && card.powers.length > 0) {
            cardList.damage += 10;
          }
        });

        player.marker.addMarker(this.CHILLING_CURTAIN_MARKER, this);

        return state;
      }
      return state;
    }
      
    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.CHILLING_CURTAIN_MARKER, this);
    }

    return state;
  }
}