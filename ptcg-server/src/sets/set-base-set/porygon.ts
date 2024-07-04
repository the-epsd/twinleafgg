import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, PokemonCardList, GameError, GameMessage, SelectPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';


export class Porygon extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 30;

  public weakness = [{ type: CardType.FIGHTING }];

  public resistance = [{ type: CardType.PSYCHIC, value: -30 }];

  public retreat = [];

  public attacks = [{
    name: 'Conversion 1',
    cost: [CardType.COLORLESS],
    damage: 0,
    text: 'If the Defending Pokémon has a Weakness, you may change it to a type of your choice other than Colorless.'
  },
  {
    name: 'Conversion 2',
    cost: [CardType.COLORLESS, CardType.COLORLESS],
    damage: 0,
    text: 'Change Porygon\'s Resistance to a type of your choice other than Colorless.'
  }
  ];

  public set: string = 'BS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '39';

  public name: string = 'Porygon';

  public fullName: string = 'Porygon BS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const cardList = StateUtils.findCardList(state, this) as PokemonCardList;

      if (cardList.specialConditions.length > 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
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
      }
      );
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this) as PokemonCardList;

      if (cardList.specialConditions.length > 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
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
        this.resistance = [{ type: option.value, value: -30 }];
      });
    }
    return state;
  }
}