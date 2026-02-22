import { GameError, GameMessage, PlayerType, PowerType } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class Regigigas extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 180;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Giant Stomp',
    cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
    damage: 160,
    text: 'Discard any Stadium card in play.'
  }];

  public set: string = 'CIN';

  public name: string = 'Regigigas';

  public fullName: string = 'Regigigas CIN';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '84';

  public powers = [{
    name: 'Seal of Antiquity',
    text: 'This Pokémon can\'t attack unless Regirock, Regice, and Registeel are on your Bench.',
    powerType: PowerType.ABILITY,
    useWhenInPlay: false
  }];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      let hasRegirock = false;
      let hasRegice = false;
      let hasRegisteel = false;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === this) {
          if (this.name.includes('Regirock')) {
            hasRegirock = true;
          }
          if (this.name.includes('Regice')) {
            hasRegice = true;
          }
          if (this.name.includes('Registeel')) {
            hasRegisteel = true;
          }
        }
      });

      if (!hasRegirock || !hasRegice || !hasRegisteel) {
        throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
      }

      return state;
    }

    return state;
  }

}
