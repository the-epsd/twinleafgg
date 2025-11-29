import { CardTag, CardType, PokemonCard, Stage, PowerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { CoinFlipPrompt, GameMessage } from '../../game';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class MegaHawluchaex extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_SV_MEGA, CardTag.POKEMON_ex];
  public cardType: CardType = F;
  public hp: number = 250;
  public weakness = [{ type: P }];
  public resistance = [];
  public retreat = [C];

  public powers = [{
    name: 'Resilient Body',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon would be Knocked Out by damage from an attack, flip a coin. If heads, this Pokémon is not Knocked Out, and its remaining HP becomes 10.'
  }];

  public attacks = [{
    name: 'Somersault Dive',
    cost: [F, F, C],
    damage: 120,
    text: 'If there is a Stadium in play, this attack does 140 more damage. Then, discard that Stadium.'
  }];

  public regulationMark: string = 'I';
  public set: string = 'M2a';
  public setNumber: string = '94';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Mega Hawlucha ex';
  public fullName: string = 'Mega Hawlucha ex M2a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Resilient Body ability
    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this)) {
      const player = StateUtils.findOwner(state, effect.target);

      // Check if ability is blocked
      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      // Check if damage would cause knockout
      const checkHpEffect = new CheckHpEffect(player, effect.target);
      store.reduceEffect(state, checkHpEffect);

      if (effect.damage >= checkHpEffect.hp) {
        // Flip a coin to see if we survive
        return store.prompt(state, new CoinFlipPrompt(
          player.id,
          GameMessage.COIN_FLIP
        ), result => {
          if (result === true) {
            // If heads, prevent knockout and set HP to 10
            effect.surviveOnTenHPReason = this.powers[0].name;
          }
          return state;
        });
      }
    }

    // Somersault Dive attack
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const stadiumCard = StateUtils.getStadiumCard(state);

      if (stadiumCard !== undefined) {
        // Add 140 damage if Stadium is in play
        effect.damage += 140;

        // Discard the Stadium
        const cardList = StateUtils.findCardList(state, stadiumCard);
        const stadiumOwner = StateUtils.findOwner(state, cardList);
        cardList.moveTo(stadiumOwner.discard);
      }
    }

    return state;
  }
}
