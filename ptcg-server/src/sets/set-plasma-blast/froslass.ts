import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, EnergyType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, StateUtils, GameError, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { WAS_ATTACK_USED, IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class Froslass extends PokemonCard {
  public tags = [CardTag.TEAM_PLASMA];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Snorunt';
  public cardType: CardType = W;
  public hp: number = 90;
  public weakness = [{ type: M }];
  public retreat = [C];

  public powers = [{
    name: 'Cursed Glare',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'As long as this Pok\u00e9mon is your Active Pok\u00e9mon, your opponent can\'t attach any Special Energy cards from his or her hand to his or her Pok\u00e9mon.'
  }];

  public attacks = [
    {
      name: 'Blizzard',
      cost: [W, C],
      damage: 30,
      text: 'Does 10 damage to each of your opponent\'s Benched Pok\u00e9mon. (Don\'t apply Weakness and Resistance for Benched Pok\u00e9mon.)'
    }
  ];

  public set: string = 'PLB';
  public setNumber: string = '23';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Froslass';
  public fullName: string = 'Froslass PLB';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ability: Cursed Glare - Block opponent's special energy attachment
    if (effect instanceof AttachEnergyEffect && effect.energyCard.energyType === EnergyType.SPECIAL) {
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);

      // Must be in play and active
      if (StateUtils.isPokemonInPlay(owner, this) && owner.active.cards.includes(this)) {
        if (!IS_ABILITY_BLOCKED(store, state, owner, this)) {
          // Only block opponent's attachments
          if (effect.player !== owner) {
            throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
          }
        }
      }
    }

    // Attack: Blizzard
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      opponent.bench.forEach(benched => {
        if (benched.cards.length > 0) {
          const damage = new PutDamageEffect(effect, 10);
          damage.target = benched;
          store.reduceEffect(state, damage);
        }
      });
    }

    return state;
  }
}
