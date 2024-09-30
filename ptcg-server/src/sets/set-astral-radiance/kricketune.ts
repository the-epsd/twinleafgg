import { Attack, CardType, PlayerType, PokemonCard, Power, PowerType, Stage, State, StoreLike } from '../../game';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';

export class Kricketune extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Kricketot';
  public cardType: CardType = G;
  public hp: number = 90;
  public weakness = [{ type: R }];
  public retreat = [C];

  public powers: Power[] = [
    {
      name: 'Swelling Tune',
      powerType: PowerType.ABILITY,
      text: 'Your [G] Pokémon in play, except any Kricketune, get +40 HP. You can\'t apply more than 1 Swelling Tune Ability at a time.'
    }
  ];

  public attacks: Attack[] = [
    {
      name: 'Slash',
      cost: [G, C],
      damage: 50,
      text: ''
    }
  ];

  public set: string = 'ASR';
  public regulationMark = 'F';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '10';
  public name: string = 'Kricketune';
  public fullName: string = 'Kricketune ASR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckHpEffect) {
      const player = effect.player;

      if (player.marker.hasMarker('SWELLING_TUNE_MARKER')) {
        return state;
      }

      player.marker.addMarkerToState('SWELLING_TUNE_MARKER');

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        const pokemonCard = cardList.getPokemonCard();
        if (pokemonCard && pokemonCard.cardType === CardType.GRASS && pokemonCard.name !== 'Kricketune') {
          effect.hp += 40;
        }
      });
    }
    return state;
  }
}