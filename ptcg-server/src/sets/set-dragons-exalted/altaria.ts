import { CardType, GamePhase, PlayerType, PokemonCard, PowerType, Stage, State, StateUtils, StoreLike } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class Altaria extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Swablu';
  public cardType: CardType = N;
  public hp: number = 70;
  public weakness = [{ type: N }];
  public retreat = [C];

  public powers = [{
    name: 'Fight Song',
    powerType: PowerType.ABILITY,
    text: 'Your [N] Pokémon\'s attacks do 20 more damage to the Active Pokémon (before applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'Glide',
    cost: [W, M, C],
    damage: 40,
    text: ''
  }];

  public set: string = 'DRX';
  public setNumber: string = '84';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Altaria';
  public fullName: string = 'Altaria DRX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PutDamageEffect && StateUtils.isPokemonInPlay(effect.player, this)) {
      if (state.phase !== GamePhase.ATTACK)
        return state;

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      if (owner !== player)
        return state;

      const checkPokemonType = new CheckPokemonTypeEffect(player.active);
      store.reduceEffect(state, checkPokemonType);

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          if (!checkPokemonType.cardTypes.includes(N))
            return state;
          const attack = effect.attack;
          if (attack && attack.damage > 0 && (effect.target === opponent.active || effect.target === effect.player.active))
            effect.damage += 20;
        }
      });
    }
    return state;
  }
}