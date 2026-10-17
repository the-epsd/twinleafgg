import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { Card, ChooseEnergyPrompt, GameMessage, PlayerType, PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DiscardCardsEffect } from '../../../game/store/effects/attack-effects';
import { CheckAttackCostEffect, CheckHpEffect, CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Salamence extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Shelgon';
  public hp: number = 140;
  public cardType: CardType[] = [C];
  public weakness = [{ type: C, value: +30 }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Battle Rush',
    powerType: PowerType.POKEBODY,
    text: 'If your opponent has any Pokémon in play that has maximum HP of 120 or more, ignore all Colorless Energy necessary to use Salamence\'s attacks.'
  }];

  public attacks = [{
    name: 'Combustion',
    cost: [R, C],
    damage: 50,
    text: ''
  },
  {
    name: 'Steam Twister',
    cost: [R, W, C, C],
    damage: 120,
    text: 'Discard a Fire Energy and a Water Energy attached to Salamence.'
  }];

  public set: string = 'SF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '24';
  public name: string = 'Salamence';
  public fullName: string = 'Salamence SF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Battle Rush
    if (effect instanceof CheckAttackCostEffect && effect.player.active.getPokemonCard() === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }
      let hasLargeHp = false;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        const checkHp = new CheckHpEffect(opponent, cardList);
        store.reduceEffect(state, checkHp);
        if (checkHp.hp >= 120) {
          hasLargeHp = true;
        }
      });
      if (hasLargeHp) {
        effect.cost = effect.cost.filter(c => c !== CardType.COLORLESS);
      }
    }

    // Steam Twister
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);
      return store.prompt(state, new ChooseEnergyPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        checkProvidedEnergy.energyMap,
        [CardType.FIRE, CardType.WATER],
        { allowCancel: false }
      ), energy => {
        const cards: Card[] = (energy || []).map(e => e.card);
        const discardEnergy = new DiscardCardsEffect(effect, cards);
        discardEnergy.target = player.active;
        store.reduceEffect(state, discardEnergy);
      });
    }

    return state;
  }
}
