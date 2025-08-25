import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, ChooseCardsPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { MOVE_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON } from '../../game/store/prefabs/attack-effects';

export class Armaldo extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Anorith';
  public tags = [CardTag.DELTA_SPECIES];
  public cardType: CardType = CardType.FIGHTING;
  public additionalCardTypes = [CardType.METAL];
  public hp: number = 110;
  public weakness = [{ type: CardType.GRASS }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Delta Edge',
    cost: [M, C],
    damage: 70,
    text: 'If you have any Supporter cards in play, this attack\'s base damage is 20 instead of 70.'
  },
  {
    name: 'Fossil Charge',
    cost: [F, C, C],
    damage: 50,
    text: 'You may discard a Claw Fossil, Mysterious Fossil, Root Fossil, or Holon Fossil from your hand. If you do, choose 1 of your opponent\'s Benched Pokémon and do 30 damage to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'HP';
  public fullName: string = 'Armaldo HP';
  public name: string = 'Armaldo';
  public setNumber: string = '1';
  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (effect.player.supporterTurn > 0) {
        effect.damage = 20;
      }
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      const blocked: number[] = [];
      player.hand.cards.forEach((card, index) => {
        if (card.name === 'Claw Fossil' || card.name === 'Mysterious Fossil' || card.name === 'Root Fossil' || card.name === 'Holon Fossil') {
          return;
        } else {
          blocked.push(index);
        }
      });
      if (blocked.length === player.hand.cards.length) {
        return state;
      }

      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.hand,
        {},
        { allowCancel: true, min: 0, max: 1, blocked }
      ), cards => {
        cards = cards || [];
        if (cards.length === 0) {
          return;
        }
        MOVE_CARDS(store, state, player.hand, player.discard, { cards: cards, sourceCard: this, sourceEffect: this.attacks[1] });
        THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON(30, effect, store, state);
      });

    }

    return state;
  }
}