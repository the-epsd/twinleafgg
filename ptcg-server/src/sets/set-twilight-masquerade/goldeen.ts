import { CardType, Stage, SuperType } from '../../game/store/card/card-types';
import { Attack, Card, ChooseCardsPrompt, CoinFlipPrompt, EnergyCard, GameMessage, PokemonCard, Power, PowerType, State, StateUtils, StoreLike } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class Goldeen extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'H';

  public cardType: CardType = W;

  public hp: number = 50;

  public weakness = [{ type: L }];

  public retreat = [C];

  public powers: Power[] = [{
    name: 'Festival Lead',
    powerType: PowerType.ABILITY,
    text: 'If Festival Grounds is in play, this Pokémon may use an attack it has twice. If the first attack Knocks Out your opponent\'s Active Pokémon, you may attack again after your opponent chooses a new Active Pokémon.'
  }];

  public attacks: Attack[] = [{
    name: 'Whirlpool',
    cost: [C, C],
    damage: 10,
    text: 'Flip a coin. If heads, discard an Energy from your opponent\'s Active Pokémon.'
  }];

  public set: string = 'TWM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '44';

  public name: string = 'Goldeen';

  public fullName: string = 'Goldeen TWM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && this.attacks.includes(effect.attack)) {
      const stadiumCard = StateUtils.getStadiumCard(state);
      if (stadiumCard && stadiumCard.name === 'Festival Grounds' && !IS_ABILITY_BLOCKED(store, state, effect.player, this)) {
        this.maxAttacksThisTurn = 2;
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Defending Pokemon has no energy cards attached
      if (!opponent.active.cards.some(c => c instanceof EnergyCard)) {
        return state;
      }

      state = store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {

          let card: Card;
          return store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARD_TO_DISCARD,
            opponent.active,
            { superType: SuperType.ENERGY },
            { min: 1, max: 1, allowCancel: false }
          ), selected => {
            card = selected[0];

            opponent.active.moveCardTo(card, opponent.discard);
          });
        }
      });

    }
    return state;
  }
}
