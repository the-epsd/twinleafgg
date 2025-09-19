import { Attack, CardType, PokemonCard, Power, PowerType, Stage, State, StateUtils, StoreLike } from '../../game';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class Ludicolo extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Lombre';
  public cardType: CardType = W;
  public hp: number = 140;
  public weakness = [{ type: L }];
  public retreat = [C, C];

  public powers: Power[] = [
    {
      name: 'Vital Samba',
      powerType: PowerType.ABILITY,
      text: 'Your Pokémon in play get +40 HP. This Ability doesn\'t stack.'
    }
  ];

  public attacks: Attack[] = [{ name: 'Hydro Splash', cost: [W, W, C], damage: 130, text: '' }];

  public set: string = 'JTG';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '37';
  public name: string = 'Ludicolo';
  public fullName: string = 'Ludicolo JTG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckHpEffect) {
      const cardList = StateUtils.findCardList(state, this);
      const player = StateUtils.findOwner(state, cardList);

      if (!StateUtils.isPokemonInPlay(player, this) || IS_ABILITY_BLOCKED(store, state, player, this) || effect.nonstackingBoosts.includes(this.powers[0].name)) {
        return state;
      }

      effect.hp += 40;
      effect.nonstackingBoosts.push(this.powers[0].name);
    }

    return state;
  }
}