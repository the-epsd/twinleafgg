import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { State } from '../../game/store/state/state';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';
import { ConfirmPrompt, GameMessage, StateUtils } from '../../game';

export class RoaringMoonex extends PokemonCard {

  public regulationMark = 'G';

  public tags = [ CardTag.POKEMON_ex, CardTag.ANCIENT ];
  
  public stage = Stage.BASIC;

  public  cardType = CardType.DARK;

  public hp = 230;

  public weakness = [{type: CardType.GRASS}];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Frenzied Gouging',
      cost: [ CardType.DARK, CardType.DARK, CardType.COLORLESS ],
      damage: 0,
      text: 'Knock Out your opponent\'s Active Pokémon. If your opponent\'s Active Pokémon is Knocked Out in this way, this Pokémon does 200 damage to itself.'
    },
    {
      name: 'Calamity Storm',
      cost: [ CardType.DARK, CardType.DARK, CardType.COLORLESS ],
      damage: 100,
      text: 'You may discard a Stadium in play. If you do, this attack does 120 more damage.'
    }
  ];

  public set: string = 'PAR';
  public set2: string = 'ancientroar';
  public setNumber: string = '54';
  public name: string = 'Roaring Moon ex';
  public fullName: string = 'Roaring Moon ex PAR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const activePokemon = opponent.active.getPokemonCard();
      if (activePokemon) {
        activePokemon.hp = 0;
      }
      this.hp -= 200;
      
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const stadiumCard = StateUtils.getStadiumCard(state);
      if (stadiumCard !== undefined) {
  
        state = store.prompt(state, new ConfirmPrompt(
          effect.player.id,
          GameMessage.WANT_TO_USE_ABILITY,
        ), wantToUse => {
          if (wantToUse) {
      
            // Discard Stadium
            const cardList = StateUtils.findCardList(state, stadiumCard);
            const player = StateUtils.findOwner(state, cardList);
            cardList.moveTo(player.discard);
            effect.damage += 120;
            return state;
          }
          return state;
        });
        return state;
      }
      return state;
    }
    return state;
  }
}