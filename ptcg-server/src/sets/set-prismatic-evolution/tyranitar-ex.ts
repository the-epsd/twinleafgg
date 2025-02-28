import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, ChooseCardsPrompt, GameMessage, EnergyCard } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Tyranitarex extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Pupitar';
  public tags = [ CardTag.POKEMON_ex ];
  public cardType: CardType = D;
  public hp: number = 340;
  public weakness = [{ type: G }];
  public retreat = [ C, C, C ];

  public attacks = [
    {
      name: 'Grind',
      cost: [ C ],
      damage: 50,
      damageCalculation: 'x',
      text: 'This attack does 50 damage for each Energy attached to this Pokémon.'
    },
    {
      name: 'Tyranical Crush',
      cost: [ D, C, C ],
      damage: 150,
      text: 'Discard a random card from your opponent\'s hand.'
    },
    
  ];

  public set: string = 'PRE';
  public regulationMark = 'H';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '64';
  public name: string = 'Tyranitar ex';
  public fullName: string = 'Tyranitar ex PRE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Grind
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]){
      const player = effect.player;

      const energies = player.active.cards.filter( card => card instanceof EnergyCard );
      effect.damage = 50 * energies.length;
    }

    // Tyranical Crush
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]){
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
  
      if (opponent.hand.cards.length === 0){
        return state;
      }
  
      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        opponent.hand,
        {},
        { allowCancel: false, min: 1, max: 1, isSecret: true }
      ), cards => {
        cards = cards || [];
  
        opponent.hand.moveCardsTo(cards, opponent.discard);
      });
    }

    return state;
  }
}
