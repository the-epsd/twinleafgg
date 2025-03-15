import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike,State, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class ArvensToedscruel extends PokemonCard {
  public regulationMark = 'I';
  public tags = [CardTag.ARVENS];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Arven\'s Toedscool'
  public cardType: CardType = F;
  public hp: number = 140;
  public weakness = [{ type: G }];
  public retreat = [ C, C ];

  public attacks = [
    {
      name: 'Pull',
      cost: [ C ],
      damage: 0,
      text: 'Switch in 1 of your opponent\'s Benched Pokémon to the Active Spot.'
    },
    {
      name: 'Reckless Charge',
      cost: [ C, C, C ],
      damage: 120,
      text: 'This Pokémon also does 30 damage to itself.'
    },
    
  ];

  public set: string = 'SV9a';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '48';
  public name: string = 'Arven\'s Toedscruel';
  public fullName: string = 'Arven\'s Toedscruel SV9a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Pull
    if (WAS_ATTACK_USED(effect, 0, this)){
      const player = effect.player;
      const opponent = effect.opponent;

      const hasBench = opponent.bench.some(b => b.cards.length > 0);
      if (!hasBench) {
        return state;
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_SWITCH,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH],
        { allowCancel: false }
      ), result => {
        opponent.switchPokemon(result[0]);
      });
    }
    
    // Reckless Charge
    if (WAS_ATTACK_USED(effect, 1, this)){
      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 30);
    }
    
    return state;
  }
}