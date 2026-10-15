import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DealDamageEffect } from '../../../game/store/effects/attack-effects';
import { CheckPokemonAttacksEffect } from '../../../game/store/effects/check-effects';
import { ADD_CONFUSION_TO_PLAYER_ACTIVE, FLIP_UNTIL_TAILS_AND_COUNT_HEADS, IS_POKEBODY_BLOCKED, MOVE_CARDS, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Gyarados extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Magikarp';
  public hp: number = 120;
  public cardType: CardType[] = [W];
  public weakness = [{ type: L, value: +30 }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Dragon DNA',
    powerType: PowerType.POKEBODY,
    text: 'Gyarados can use any attack from its Basic Pokémon. (You still have to pay for that attack\'s Energy cost.) If Gyarados uses any attack from its Basic Pokémon, that attack does 30 more damage to the Defending Pokémon (before applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'Enrage',
    cost: [W, W, C, C],
    damage: 80,
    text: 'Flip a coin until you get tails. For each heads, choose 1 card from your opponent\'s hand without looking and discard it. If the first coin is tails, Gyarados is now Confused.'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '26';
  public name: string = 'Gyarados';
  public fullName: string = 'Gyarados MT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Dragon DNA — inherit Basic Pokémon attacks
    if (effect instanceof CheckPokemonAttacksEffect && effect.player.active.cards.includes(this)) {
      const player = effect.player;

      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }

      const cardList = StateUtils.findCardList(state, this);
      for (const card of cardList.cards) {
        if (
          card.superType === SuperType.POKEMON &&
          card !== this &&
          (card as PokemonCard).stage === Stage.BASIC
        ) {
          for (const attack of (card as PokemonCard).attacks) {
            if (!effect.attacks.includes(attack)) {
              effect.attacks.push(attack);
            }
          }
        }
      }
    }

    // Dragon DNA — +30 when using a Basic Pokémon's attack
    if (effect instanceof DealDamageEffect && effect.source.getPokemonCard() === this) {
      const player = effect.player;

      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }

      const cardList = StateUtils.findCardList(state, this);
      const usingBasicAttack = cardList.cards.some(card =>
        card.superType === SuperType.POKEMON &&
        card !== this &&
        (card as PokemonCard).stage === Stage.BASIC &&
        (card as PokemonCard).attacks.includes(effect.attack)
      );

      if (usingBasicAttack && effect.target === effect.opponent.active) {
        effect.damage += 30;
      }
    }

    // Enrage
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      return FLIP_UNTIL_TAILS_AND_COUNT_HEADS(store, state, player, heads => {
        if (heads === 0) {
          ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, player, this);
          return;
        }

        for (let i = 0; i < heads; i++) {
          if (opponent.hand.cards.length === 0) {
            break;
          }
          const randomIndex = Math.floor(Math.random() * opponent.hand.cards.length);
          const randomCard = opponent.hand.cards[randomIndex];
          MOVE_CARDS(store, state, opponent.hand, opponent.discard, {
            cards: [randomCard],
            sourceCard: this,
            sourceEffect: this.attacks[0],
          });
        }
      });
    }

    return state;
  }
}
