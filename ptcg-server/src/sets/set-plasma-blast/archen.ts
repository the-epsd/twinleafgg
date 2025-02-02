import { GameError, GameLog, GameMessage, PowerType } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class Archen extends PokemonCard {

  public stage: Stage = Stage.RESTORED;

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 70;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [ CardType.COLORLESS ];

  public powers = [{
    name: 'Prehistoric Call',
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), if this Pokémon is in your discard pile, you may put this Pokémon on the bottom of your deck.'
  }];
  
  public attacks = [{
    name: 'Wing Attack',
    cost: [ CardType.COLORLESS, CardType.COLORLESS ],
    damage: 20,
    text: ''
  }];

  public set: string = 'PLB';

  public name: string = 'Archen';

  public fullName: string = 'Archen PLB';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '53';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      
      // Check if card is in the discard
      if (!player.discard.cards.includes(this)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const card = player.discard.cards.filter(c => c === this)[0];
      player.discard.moveCardTo(card, player.deck);
      
      store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_ON_BOTTOM_OF_DECK, { name: player.name, card: this.name });
    }

    return state;
  }

}
