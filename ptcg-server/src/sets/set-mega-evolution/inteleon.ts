import { CardTarget, ChoosePokemonPrompt, GameError, GameMessage, PlayerType, SlotType, State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { KnockOutEffect } from '../../game/store/effects/game-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Inteleon extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Drizzile';
  public cardType: CardType = W;
  public hp: number = 100;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [{
    name: 'Bring Down',
    cost: [W],
    damage: 0,
    text: 'The Pokémon in play that has the least HP remaining, except for this Pokémon, is Knocked Out. (If there are multiple Pokémon, choose 1.)'
  },
  {
    name: 'Water Shot',
    cost: [W, W],
    damage: 110,
    text: 'Discard an Energy from this Pokémon.'
  }];

  public set: string = 'M1S';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '23';
  public name: string = 'Inteleon';
  public fullName: string = 'Inteleon M1S';
  public regulationMark = 'I';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = effect.opponent;
      let leastHP = 9999999999999999;

      // figuring out which pokemon actually has the least hp
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, card => {
        if (card !== player.active) {
          const hpCheck = new CheckHpEffect(player, card);
          if (hpCheck.hp < leastHP) { leastHP = hpCheck.hp; }
        }
      });
      opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, card => {
        const hpCheck = new CheckHpEffect(opponent, card);
        if (hpCheck.hp < leastHP) { leastHP = hpCheck.hp; }
      });

      // making sure it gets put on the active pokemon
      if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
        if (effect.target !== effect.player.active) { throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD); }
      }

      // eliminating the pokemon that don't have the least hp from being chosen
      const blockedTo: CardTarget[] = [];
      player.forEachPokemon(PlayerType.TOP_PLAYER, (list, card, target) => {
        const hpCheck = new CheckHpEffect(player, list);
        if (list === player.active) { blockedTo.push(target); }
        else if (hpCheck.hp !== leastHP) {
          blockedTo.push(target);
        }
      });
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (list, card, target) => {
        const hpCheck = new CheckHpEffect(opponent, list);
        if (hpCheck.hp !== leastHP) {
          blockedTo.push(target);
        }
      });

      store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON,
        PlayerType.ANY,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 1, max: 1, blocked: blockedTo }
      ), target => {
        const damageEffect = new KnockOutEffect(player, target[0]);
        store.reduceEffect(state, damageEffect);
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1);
    }

    return state;
  }
}