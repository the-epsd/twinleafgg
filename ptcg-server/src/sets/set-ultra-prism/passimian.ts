import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { PowerType, StateUtils, PlayerType } from '../../game';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';


export class PassimianUPR extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 110;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Power Huddle',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokémon is on your Bench, your Passimian\'s attacks do 30 more damage to your opponent\'s Active Evolution Pokémon (before applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'Rock Hurl',
    cost: [CardType.FIGHTING, CardType.COLORLESS],
    damage: 40,
    text: 'This attack\'s damage isn\'t affected by Resistance.'
  }];

  public set: string = 'UPR';

  public setNumber = '70';

  public cardImage = 'assets/cardback.png';

  public name: string = 'Passimian';

  public fullName: string = 'Passimian UPR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof DealDamageEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // checking if this pokemon is in the active
      if (player.active.getPokemonCard() === this) {
        return state;
      }
      // checking if this pokemon is in play
      let isThisInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isThisInPlay = true;
        }
      });
      if (!isThisInPlay) {
        return state;
      }

      // somehow make this so it only affects the active passimian and not the opponent's pokemon
      const oppActive = opponent.active.getPokemonCard();
      const damageSource = effect.source.getPokemonCard();
      const stage = oppActive !== undefined ? oppActive.stage : undefined;

      if (damageSource && damageSource.name === 'Passimian' && (stage === Stage.STAGE_1 || stage === Stage.STAGE_2) && damageSource !== oppActive) {
        effect.damage += 30;
        return state;
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      effect.ignoreResistance = true;
    }
    return state;
  }
}
