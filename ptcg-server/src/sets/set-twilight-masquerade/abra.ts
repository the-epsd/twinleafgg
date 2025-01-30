import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import {GameError, GameMessage, PowerType, ShuffleDeckPrompt, State, StoreLike} from '../../game';
import {Effect} from '../../game/store/effects/effect';
import {PowerEffect} from '../../game/store/effects/game-effects';

export class Abra extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 40;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [ C ];

  public powers = [{
    name: 'Teleporter',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, if this Pokémon is in the Active Spot, you may shuffle it and all attached cards into your deck.'
  }];

  public attacks = [{
    name: 'Beam',
    cost: [ P ],
    damage: 10,
    text: '',
  }];

  public regulationMark = 'H';
  public set: string = 'TWM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '80';
  public name: string = 'Abra';
  public fullName: string = 'Abra TWM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Teleport
    if (effect instanceof PowerEffect && effect.power === this.powers[0]){
      const player = effect.player;

      if (player.active.getPokemonCard() !== this){
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      player.active.moveTo(player.deck);
      player.active.clearEffects();

      return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
      });
    }

    return state;
  }
}