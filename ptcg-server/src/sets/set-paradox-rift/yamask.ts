import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, ChoosePokemonPrompt, PlayerType, SlotType } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { PutCountersEffect } from '../../game/store/effects/attack-effects';

export class Yamask extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.PSYCHIC;
  public hp: number = 70;
  public weakness = [{ type: CardType.DARK }];
  public resistance = [{ type: CardType.FIGHTING, value: -30 }];
  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    { name: 'Ominous Eyes', 
      cost: [ CardType.PSYCHIC, CardType.PSYCHIC ], 
      damage: 0, 
      text: 'Put 3 damage counters on 1 of your opponent\'s Pokémon.' }
  ];

  public set: string = 'PAR';
  public regulationMark = 'G';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '75';

  public name: string = 'Yamask';
  public fullName: string = 'Yamask PAR';

  
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]){
      const player = effect.player;
    
      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [ SlotType.ACTIVE, SlotType.BENCH ],
        { allowCancel: false }
      ), targets => {
        if (!targets || targets.length === 0) {
          return;
        }
        const damageEffect = new PutCountersEffect(effect, 30);
        damageEffect.target = targets[0];
        store.reduceEffect(state, damageEffect);
      });
    }

    return state;
  }
  
}