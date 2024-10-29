import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Eternatus extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = N;

  public hp: number = 150;

  public weakness = [];

  public resistance = [];

  public retreat = [C, C];

  public attacks = [
    {
      name: 'Dynablast',
      cost: [D],
      damage: 10,
      damageCalculation: '+',
      text: 'If your opponent\'s Active Pokémon is a Pokémon ex, this attack does 80 more damage.'
    },
    {
      name: 'World\'s End',
      cost: [R, D, D],
      damage: 230,
      text: 'Discard a Stadium in play. If you can\'t, this attack does nothing.'
    }
  ];

  public set: string = 'SSP';

  public regulationMark = 'H';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '141';

  public name: string = 'Eternatus';

  public fullName: string = 'Eternatus SV8';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const opponentActive = opponent.active.getPokemonCard();
      if (opponentActive && (opponentActive.tags.includes(CardTag.POKEMON_ex))) {
        effect.damage += 80;
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const stadiumCard = StateUtils.getStadiumCard(state);

      if (stadiumCard === undefined) {
        effect.damage = 0;
        return state;
      }

      // Discard Stadium
      const cardList = StateUtils.findCardList(state, stadiumCard);
      const player = StateUtils.findOwner(state, cardList);
      cardList.moveTo(player.discard);
      effect.damage = 230; // Set the damage to 230 as specified in the original attack
      return state;
    }
    return state;
  }
}
