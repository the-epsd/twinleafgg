import { ChoosePokemonPrompt, GameMessage, PlayerType, PowerType, SlotType, State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Tyrogue extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 60;

  public retreat = [ ];

  public powers = [{
    name: 'Bratty Kick',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Once during your turn (before your attack), you may flip a coin. If heads, put 3 damage counters on 1 of your opponent\'s Pokémon. If you use this Ability, your turn ends.'
  }];

  public set: string = 'UNB';

  public name: string = 'Tyrogue';

  public fullName: string = 'Tyrogue UNB';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '100';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        const targets = selected || [];
        targets.forEach(target => {
          target.damage += 30;
        });
        
        const endTurnEffect = new EndTurnEffect(player);
        store.reduceEffect(state, endTurnEffect);
        
        return state;
      });
    
    }
    
    return state;
  }

}
