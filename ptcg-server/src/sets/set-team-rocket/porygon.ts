import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameMessage, SelectPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import {ADD_CONFUSION_TO_PLAYER_ACTIVE, COIN_FLIP_PROMPT, WAS_ATTACK_USED} from '../../game/store/prefabs/prefabs';

export class Porygon extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 40;
  public weakness = [{ type: F }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [];

  public attacks = [
    {
      name: 'Conversion 1',
      cost: [C],
      damage: 0,
      text: 'If the Defending Pokémon has a Weakness, you may change it to a type of your choice other than [C].'
    },
    {
      name: 'Psybeam',
      cost: [C, C, C],
      damage: 20,
      text: 'Flip a coin. If heads, the Defending Pokémon is now Confused.'
    }
  ];

  public set: string = 'TR';
  public setNumber: string = '48';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Porygon';
  public fullName: string = 'Porygon TR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Conversion 1
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.active.getPokemonCard()?.weakness === undefined){
        return state;
      }

      const options = [
        { value: CardType.DARK, message: 'Dark' },
        { value: CardType.DRAGON, message: 'Dragon' },
        { value: CardType.FAIRY, message: 'Fairy' },
        { value: CardType.FIGHTING, message: 'Fighting' },
        { value: CardType.FIRE, message: 'Fire' },
        { value: CardType.GRASS, message: 'Grass' },
        { value: CardType.LIGHTNING, message: 'Lightning' },
        { value: CardType.METAL, message: 'Metal' },
        { value: CardType.PSYCHIC, message: 'Psychic' },
        { value: CardType.WATER, message: 'Water' }
      ];

      return store.prompt(state, new SelectPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGY_TYPE,
        options.map(c => c.message),
        { allowCancel: false }
      ), choice => {
        const option = options[choice];

        if (!option) {
          return state;
        }
        const oppActive = opponent.active.getPokemonCard();
        if (oppActive) {
          oppActive.weakness = [{ type: option.value }];
        }
      });
    }

    // Psybeam
    if (WAS_ATTACK_USED(effect, 1, this)){
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) { ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, effect.opponent, this); }
      });
    }

    return state;
  }

}