import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, PlayerType } from '../../game';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';


export class Scizor extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.METAL;

  public hp: number = 140;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public resistance = [{ type: CardType.GRASS, value: -30 }];

  public attacks = [
    { 
      name: 'Punishing Scissors', 
      cost: [CardType.METAL], 
      damage: 10, 
      text: 'This attack does 50 more damage for each of your opponent\'s Pokémon in play that has an Ability.' 
    },
    { 
      name: 'Cut', 
      cost: [CardType.METAL, CardType.METAL], 
      damage: 70, 
      text: '' 
    },   
  ];

  public set: string = 'OBF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '141';

  public name: string = 'Scizor';

  public fullName: string = 'Scizor OBF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let abilityPokemon = 0;

      opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        const pokemon = cardList.getPokemonCard();

        if (pokemon && pokemon.powers && pokemon.powers.length > 0) {
          const checkPokemonType = new CheckPokemonTypeEffect(cardList);
          store.reduceEffect(state, checkPokemonType);
          abilityPokemon++;
        }

        effect.damage += abilityPokemon * 50;

      });
      return state;
    }
    return state;
  }
}