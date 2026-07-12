import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { ConfirmPrompt, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, StoreLike, State, StateUtils } from '../../../game';
import { PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { Effect } from '../../../game/store/effects/effect';
import { OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Golduck extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Psyduck';
  public cardType: CardType = W;
  public hp: number = 110;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Amnesia',
    cost: [W],
    damage: 20,
    text: 'Choose 1 of your opponent\'s Active Pokémon\'s attacks. That Pokémon can\'t use that attack during your opponent\'s next turn.'
  },
  {
    name: 'Swim',
    cost: [C, C, C],
    damage: 90,
    text: 'If any of your opponent\'s Pokémon have any [W] Energy attached to them, you may do 90 damage to 1 of your opponent\'s Benched Pokémon instead of their Active Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'TEU';
  public setNumber: string = '27';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Golduck';
  public fullName: string = 'Golduck TEU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK(store, state, effect, this);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let hasWaterEnergy = false;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        const checkEnergy = new CheckProvidedEnergyEffect(opponent, cardList);
        store.reduceEffect(state, checkEnergy);
        if (checkEnergy.energyMap.some(em => em.provides.includes(CardType.WATER))) {
          hasWaterEnergy = true;
        }
      });

      const hasBench = opponent.bench.some(b => b.cards.length > 0);

      if (hasWaterEnergy && hasBench) {
        store.prompt(state, new ConfirmPrompt(
          effect.player.id,
          GameMessage.WANT_TO_USE_ABILITY
        ), result => {
          if (!result) {
            return;
          }

          store.prompt(state, new ChoosePokemonPrompt(
            player.id,
            GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
            PlayerType.TOP_PLAYER,
            [SlotType.BENCH],
            { allowCancel: false }
          ), targets => {
            if (!targets || targets.length === 0) {
              return;
            }
            const damageEffect = new PutDamageEffect(effect, 90);
            damageEffect.target = targets[0];
            store.reduceEffect(state, damageEffect);
            effect.preventDefault = true;
          });
        });
      }
    }

    return state;
  }
}
