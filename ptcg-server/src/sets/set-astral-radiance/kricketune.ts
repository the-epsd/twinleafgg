import { Attack, CardType, PlayerType, PokemonCard, Power, PowerType, Stage, State, StoreLike } from '../../game';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';

export class Kricketune extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public evolvesFrom = 'Kricketot';
  public cardType: CardType = CardType.GRASS;
  public hp: number = 90;
  public weakness = [{ type: CardType.FIRE }];
  public retreat = [CardType.COLORLESS];

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
      cost: [CardType.GRASS, CardType.COLORLESS],
      damage: 50,
      text: ''
    }
  ];

  public set: string = 'ASR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '10';
  public name: string = 'Kricketune';
  public fullName: string = 'Kricketune ASR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckHpEffect) {
      const player = effect.player;

      let kricketunesInPlay = false;
      let swellingTuneApplied = false;

      if (swellingTuneApplied) {
        return state;
      }

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (cardList.getPokemonCard()?.name === 'Kricketune') {
          kricketunesInPlay = true;
        }
      });

      if (kricketunesInPlay) {

        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
          const pokemonCard = cardList.getPokemonCard();
          if (pokemonCard && pokemonCard.cardType === CardType.GRASS && pokemonCard.name !== 'Kricketune') {
            effect.hp += 40;
            swellingTuneApplied = true;
          }
        });
      }
    }
    return state;
  }
}