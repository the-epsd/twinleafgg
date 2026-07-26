import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import { GameError, GameMessage, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { IF_OPPONENTS_POKEMON_KO_BY_ATTACK_DAMAGE_TAKE_MORE_PRIZES, MOVE_CARDS, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class MegaSableyeTyranitarGX extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_GX, CardTag.TAG_TEAM];
  public cardType: CardType = D;
  public hp: number = 280;
  public weakness = [{ type: F }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C, C, C];

  public attacks = [{
    name: 'Greedy Crush',
    cost: [D, D, D, D, C],
    damage: 210,
    text: 'If your opponent\'s Pokémon-GX or Pokémon-EX is Knocked Out by damage from this attack, take 1 more Prize card.'
  },
  {
    name: 'Gigafall-GX',
    cost: [D, D, D, D, C],
    damage: 250,
    gxAttack: true,
    text: 'If this Pokémon has at least 5 extra Energy attached to it (in addition to this attack\'s cost), discard the top 15 cards of your opponent\'s deck. (You can\'t use more than 1 GX attack in a game.)'
  }];

  public set: string = 'UNM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '126';
  public name: string = 'Mega Sableye & Tyranitar-GX';
  public fullName: string = 'Mega Sableye & Tyranitar-GX UNM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.usedGX) {
        throw new GameError(GameMessage.LABEL_GX_USED);
      }
      player.usedGX = true;

      const extraEffectCost: CardType[] = [D, D, D, D, C, C, C, C, C, C];
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergy);
      const meetsExtraEffectCost = StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, extraEffectCost);

      if (!meetsExtraEffectCost) {
        return state;
      }

      MOVE_CARDS(store, state, opponent.deck, opponent.discard, { count: 15, sourceCard: this, sourceEffect: this.attacks[1] });
    }

    return IF_OPPONENTS_POKEMON_KO_BY_ATTACK_DAMAGE_TAKE_MORE_PRIZES(store, state, effect, this, {
      attackName: 'Greedy Crush',
      validate: (_store, _state, koEffect) => {
        const targetCard = koEffect.target.getPokemonCard();
        return !!targetCard && (
          targetCard.tags.includes(CardTag.POKEMON_GX) ||
          targetCard.tags.includes(CardTag.POKEMON_EX)
        );
      },
    });
  }
}
