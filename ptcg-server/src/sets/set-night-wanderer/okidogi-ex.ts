import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, EnergyType, SuperType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, ChooseCardsPrompt, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';


export class Okidogiex extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public tags = [ CardTag.POKEMON_ex ];

  public regulationMark = 'H';

  public cardType: CardType = CardType.DARK;

  public weakness = [{ type: CardType.FIGHTING }];

  public hp: number = 250;

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Poison Muscle',
      cost: [ CardType.COLORLESS ],
      damage: 0,
      text: 'Attach up to 2 Basic Darkness Energy from your deck to this Pokémon, then shuffle your deck. If you attached any Energy this way, this Pokémon is now Poisoned.'
    },
    {
      name: 'Crazy Chain',
      cost: [ CardType.DARK, CardType.DARK, CardType.COLORLESS ],
      damage: 130,
      text: 'If this Pokémon is Poisoned, this attack does 130 more.'
    }
  ];

  public set: string = 'SV6a';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '36';
  
  public name: string = 'Okidogi ex';
  
  public fullName: string = 'Okidogi ex SV6a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const cardList = StateUtils.findCardList(state, this);
      if (cardList === undefined) {
        return state;
      }

      return store.prompt(state, new ChooseCardsPrompt(
        player.id,
        GameMessage.CHOOSE_CARD_TO_ATTACH,
        player.deck,
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Darkness Energy' },
        { min: 0, max: 2, allowCancel: false }
      ), cards => {
        cards = cards || [];
        if (cards.length > 0) {

          player.deck.moveCardsTo(cards, cardList);

          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
          specialConditionEffect.target = effect.player.active;
          store.reduceEffect(state, specialConditionEffect);

        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {

      const poisonedCondition = effect.target.specialConditions.includes(SpecialCondition.POISONED);
      if (poisonedCondition) {
        effect.damage += 130;
      }
      return state;
    }
    return state;
  }
}