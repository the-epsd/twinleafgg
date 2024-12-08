import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { StateUtils } from '../../game/store/state-utils';
import { CardList, EnergyCard, GameLog } from '../../game';
import { KnockOutOpponentEffect } from '../../game/store/effects/attack-effects';

export class Haxorus extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Fraxure';
  public cardType: CardType = CardType.DRAGON;
  public hp: number = 170;
  public weakness = [];
  public resistance = [];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];


  public attacks = [{
    name: 'Bring Down the Axe',
    cost: [CardType.FIGHTING],
    damage: 0,
    text: 'If your opponent\'s Active Pokémon has any Special Energy attached, it is Knocked Out.'
  },
  {
    name: 'Dragon Pulse',
    cost: [CardType.FIGHTING, CardType.METAL],
    damage: 230,
    text: 'Discard the top 3 cards of your deck'
  }
  ];

  public regulationMark: string = 'H';
  public set: string = 'SFA';
  public name: string = 'Haxorus';
  public fullName: string = 'Haxorus SFA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '46';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const pokemon = opponent.active;

      let specialEnergyCount = 0;
      pokemon.cards.forEach(c => {
        if (c instanceof EnergyCard) {
          if (c.energyType === EnergyType.SPECIAL) {
            specialEnergyCount++;
          }
        }
      });

      if (specialEnergyCount > 0) {
        if (pokemon) {
          const dealDamage = new KnockOutOpponentEffect(effect, 999);
          dealDamage.target = opponent.active;
          store.reduceEffect(state, dealDamage);
        }
      }

    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      
      const deckTop = new CardList();
      player.deck.moveTo(deckTop, 3);
      const discards = deckTop.cards;
  
      deckTop.moveTo(player.discard, deckTop.cards.length);

      discards.forEach((card, index) => {
        store.log(state, GameLog.LOG_PLAYER_DISCARDS_CARD, { name: player.name, card: card.name, effectName: effect.attack.name });
      });
      
      return state;
    }

    return state;
  }
}