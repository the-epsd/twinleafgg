import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, ShuffleDeckPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class MewV extends PokemonCard {

  public tags = [ CardTag.POKEMON_V, CardTag.FUSION_STRIKE ];
  
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 180;

  public weakness = [{ type: CardType.DARK }];

  public retreat = [ ];

  public attacks = [
    {
      name: 'Strafe',
      cost: [CardType.FIGHTING],
      damage: 30,
      text: 'You may switch this Pokémon with 1 of your Benched ' +
      'Pokémon. '
    }, {
      name: 'Psychic Leap',
      cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.COLORLESS],
      damage: 70,
      text: ''
    }
  ];

  public set: string = 'FST';

  public name: string = 'Mew V';

  public fullName: string = 'Mew V FST 113';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
  
      player.active.moveTo(player.deck);
      player.active.clearEffects();
  
      return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
      });
    }
  
    return state;
  }
  
}
  