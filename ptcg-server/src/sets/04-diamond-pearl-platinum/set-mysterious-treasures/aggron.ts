import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, EnergyType, Stage, SuperType } from '../../../game/store/card/card-types';
import { EnergyCard, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CONFIRMATION_PROMPT, MOVE_CARDS, SHOW_CARDS_TO_PLAYER, SHUFFLE_DECK, THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Aggron extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Lairon';
  public hp: number = 130;
  public cardType: CardType[] = [M];
  public weakness = [{ type: R, value: +40 }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C, C, C];

  public attacks = [{
    name: 'Heap Up',
    cost: [C, C],
    damage: 40,
    damageCalculation: '+',
    text: 'Search your discard pile for all Energy cards and show them to your opponent. If you find any Metal Special Energy cards there this attack does 40 damage plus 30 more damage. Put all of those Energy cards on top of your deck. Shuffle your deck afterward.'
  },
  {
    name: 'Hard Metal',
    cost: [M, M, M, M],
    damage: 60,
    damageCalculation: '+',
    text: 'You may do 60 damage plus 40 more damage. If you do, Aggron does 40 damage to itself.'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '1';
  public name: string = 'Aggron';
  public fullName: string = 'Aggron MT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Heap Up
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const energyInDiscard = player.discard.cards.filter(c => c.superType === SuperType.ENERGY);

      if (energyInDiscard.length === 0) {
        return state;
      }

      SHOW_CARDS_TO_PLAYER(store, state, opponent, energyInDiscard);

      const hasMetalSpecial = energyInDiscard.some(c =>
        c instanceof EnergyCard
        && c.energyType === EnergyType.SPECIAL
        && c.provides.includes(CardType.METAL)
      );
      if (hasMetalSpecial) {
        effect.damage += 30;
      }

      MOVE_CARDS(store, state, player.discard, player.deck, {
        cards: energyInDiscard,
        sourceCard: this,
        sourceEffect: this.attacks[0],
      });
      SHUFFLE_DECK(store, state, player);
    }

    // Hard Metal
    if (WAS_ATTACK_USED(effect, 1, this)) {
      CONFIRMATION_PROMPT(store, state, effect.player, result => {
        if (result) {
          effect.damage += 40;
          THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 40);
        }
      });
    }

    return state;
  }
}
