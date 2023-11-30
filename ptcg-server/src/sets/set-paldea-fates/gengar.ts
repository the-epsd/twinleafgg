import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { ChoosePokemonPrompt, GameError, GameMessage, PlayerType, PokemonCardList, PowerType, SlotType } from '../..';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';

export class Gengar extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  //   public evolvesFrom = 'Haunter';

  public cardType: CardType = CardType.DARK;

  public hp: number = 130;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [ CardType.COLORLESS ];

  public powers = [{
    name: 'Night Gate',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Once during your turn, you may switch your Active Pokémon with 1 of your Benched Pokémon.'
  }];

  public attacks = [{
    name: 'Nightmare',
    cost: [ CardType.DARK, CardType.COLORLESS ],
    damage: 100,
    text: 'Your opponent’s Active Pokémon is now Asleep.'
  }];

  public regulationMark = 'G';
  
  public set2: string = 'ragingsurf';
  
  public setNumber: string = '35';
  
  public set = 'SV4';

  public name: string = 'Gengar';

  public fullName: string = 'Gengar SV4';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {

      const player = effect.player;
      const hasBench = player.bench.some(b => b.cards.length > 0);
  
      if (hasBench === false) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
  
      // Do not discard the card yet
      effect.preventDefault = true;
  
      let targets: PokemonCardList[] = [];
      store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_SWITCH,
        PlayerType.BOTTOM_PLAYER,
        [ SlotType.BENCH ],
        { allowCancel: true }
      ), results => {
        targets = results || [];
      });
  
      if (targets.length === 0) {
        return state;
      }
  
      // Discard trainer only when user selected a Pokemon
      player.active.clearEffects();
      player.switchPokemon(targets[0]);
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
      store.reduceEffect(state, specialCondition);
      return state;
    }
    return state;
  }
}