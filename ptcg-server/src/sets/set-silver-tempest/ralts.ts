import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { ChooseAttackPrompt, GameError, GameLog, GameMessage, StateUtils } from '../../game';

export class Ralts extends PokemonCard {

  public regulationMark = 'F';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 60;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [{
    name: 'Memory Skip',
    cost: [ CardType.PSYCHIC ],
    damage: 10,
    text: 'Choose 1 of your opponent\'s Active Pokémon\'s attacks. During your opponent\'s next turn, that Pokémon can\'t use that attack.'
  }];

  public set: string = 'SIT';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '67';

  public name: string = 'Raltsx';

  public fullName: string = 'Ralts SIT';

  public readonly MEAN_LOOK_MARKER = 'MEAN_LOOK_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
  
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const pokemonCard = opponent.active.getPokemonCard();
        
      if (pokemonCard === undefined || pokemonCard.attacks.length === 0) {
        return state;
      }
        
      let selected: any;
      store.prompt(state, new ChooseAttackPrompt(
        player.id,
        GameMessage.CHOOSE_ATTACK_TO_COPY,
        [ pokemonCard ],
        { allowCancel: false }
      ), result => {
        selected = result;
      });
      
      opponent.active.marker.addMarker(this.MEAN_LOOK_MARKER, this);
        
      if (selected === null) {
        return state;
      }
        
      store.log(state, GameLog.LOG_PLAYER_COPIES_ATTACK, {
        name: player.name,
        attack: selected.name
      });
      
      if (effect instanceof AttackEffect && effect.attack === selected) {
        if (effect.opponent.active.marker.hasMarker(this.MEAN_LOOK_MARKER, this)) {
      
          throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
        }
      }
      return state;
    }
    return state;
  }
}
      