import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, StateUtils } from '../../game';
import { AfterDamageEffect } from '../../game/store/effects/attack-effects';

export class RotasBonsly extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 50;
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [{
    name: 'Feint Attack',
    cost: [F, C],
    damage: 0,
    text: 'Does 20 damage to 1 of your opponent\'s Pokémon.This attack\'s damage isn\'t affected by Weakness, Resistance, or any other effects on that Pokémon.'
  }];

  public set: string = 'PCGP';
  public name: string = 'Rota\'s Bonsly';
  public fullName: string = 'Rota\'s Bonsly PCGP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '87';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const targets = opponent.getPokemonInPlay();
      if (targets.length === 0)
        return state;

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
      ), selected => {
        const target = selected[0];
        target.damage += 20;
        const afterDamage = new AfterDamageEffect(effect, 20);
        state = store.reduceEffect(state, afterDamage);
      });
    }

    return state;
  }

}
