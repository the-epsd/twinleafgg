import { Attack, CardType, PokemonCard, Power, PowerType, Stage, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CONFIRMATION_PROMPT, IS_POKEPOWER_BLOCKED, JUST_EVOLVED, SEARCH_DECK_FOR_CARDS_TO_HAND, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Froslass extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Snorunt';
  public cardType: CardType = W;
  public hp: number = 80;
  public weakness = [{ type: M, value: +20 }];
  public retreat = [C];

  public powers: Power[] = [{
    name: 'Snow Gift',
    powerType: PowerType.POKEPOWER,
    useWhenInPlay: false,
    text: 'Once during your turn, when you play Froslass from your hand to evolve 1 of your Pokémon, you may search your deck for any 1 card and put it into your hand. Shuffle your deck afterward.'
  }];

  public attacks: Attack[] = [
    {
      name: 'Ground Frost',
      cost: [W, C],
      damage: 50,
      text: 'If there is any Stadium Card in play, this attack does nothing.'
    },
  ];

  public set: string = 'AR';
  public setNumber: string = '2';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Froslass';
  public fullName: string = 'Froslass AR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Snow Gift
    if (JUST_EVOLVED(effect, this) && !IS_POKEPOWER_BLOCKED(store, state, effect.player, this)) {
      if (CONFIRMATION_PROMPT(store, state, effect.player, result => {
        if (result) {
          const player = effect.player;
          SEARCH_DECK_FOR_CARDS_TO_HAND(store, state, player, this, {}, { min: 1, max: 1 }, this.powers[0]);
        }
      }))
        return state;
    }

    // Ground Frost
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const stadiumCard = StateUtils.getStadiumCard(state);
      if (stadiumCard !== undefined) {
        effect.damage = 0;
      }
    }
    return state;
  }
}