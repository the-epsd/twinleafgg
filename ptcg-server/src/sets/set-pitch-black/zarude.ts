import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { ChoosePokemonPrompt, GameMessage, Player, PlayerType, SlotType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { ShadowDarknessEnergy } from './shadow-darkness-energy';

export class Zarude extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 130;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Overhead Throw',
    cost: [D],
    damage: 30,
    text: 'This attack also does 30 damage to 1 of your Benched Pokémon.',
  },
  {
    name: 'Shadow Whip',
    cost: [D, D, D],
    damage: 100,
    damageCalculation: '+',
    text: 'If any of your Benched Pokémon has any Shadow Darkness Energy attached to them, this attack does 70 more damage.',
  }];

  public set: string = 'M5';
  public setNumber: string = '54';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Zarude';
  public fullName: string = 'Zarude M5';

  private benchHasShadowDarknessEnergy(player: Player): boolean {
    return player.bench.some(bench => bench.cards.length > 0
      && bench.cards.some(c => c instanceof ShadowDarknessEnergy));
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Overhead Throw
    // Ref: set-crown-zenith/dubwool.ts (Overhead Throw)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const benched = player.bench.filter(b => b.cards.length > 0);

      if (benched.length > 0) {
        store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH],
          { min: 1, max: 1, allowCancel: false }
        ), targets => {
          if (!targets || targets.length === 0) {
            return;
          }
          const damageEffect = new PutDamageEffect(effect, 30);
          damageEffect.target = targets[0];
          store.reduceEffect(state, damageEffect);
        });
      }
    }

    // Shadow Whip
    // Ref: set-pitch-black/mega-darkrai-ex.ts (Night Raid - bench scan)
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      if (this.benchHasShadowDarknessEnergy(player)) {
        effect.damage += 70;
      }
    }

    return state;
  }
}
