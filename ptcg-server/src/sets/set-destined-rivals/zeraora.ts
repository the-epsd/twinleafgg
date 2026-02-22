import { Attack, Card, CardTag, CardTarget, CardType, ChoosePokemonPrompt, GameError, GameMessage, PlayerType, PokemonCard, SlotType, Stage, State, StateUtils, StoreLike, Weakness } from '../../game';
import { DiscardCardsEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';

import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Zeraora extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 100;
  public weakness: Weakness[] = [{ type: F }];
  public retreat: CardType[] = [C];

  public attacks: Attack[] = [{
    name: 'Scratch',
    cost: [C],
    damage: 20,
    text: ''
  }, {
    name: 'Thunder Blitz',
    cost: [L, L, L],
    damage: 0,
    text: 'Discard all Energy from this Pokémon. This attack does 210 damage to 1 of your opponent\'s Benched ex Pokemon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public regulationMark: string = 'I';
  public set: string = 'DRI';
  public setNumber: string = '78';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Zeraora';
  public fullName: string = 'Zeraora DRI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let exPokemonOnOppBench = false;

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (list, card) => {
        if (card.tags.includes(CardTag.POKEMON_ex)) {
          exPokemonOnOppBench = true;
        }
      });

      if (!exPokemonOnOppBench) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      const cards: Card[] = checkProvidedEnergy.energyMap.map(e => e.card);
      const discardEnergy = new DiscardCardsEffect(effect, cards);
      discardEnergy.target = player.active;
      store.reduceEffect(state, discardEnergy);

      const blocked: CardTarget[] = [];
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (list, card, target) => {
        if (!card.tags.includes(CardTag.POKEMON_ex)) {
          blocked.push(target);
        }
      });

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH],
        { min: 1, max: 1, allowCancel: false, blocked }
      ), selected => {
        const targets = selected || [];
        targets.forEach(target => {
          const damageEffect = new PutDamageEffect(effect, 210);
          damageEffect.target = target;
          store.reduceEffect(state, damageEffect);
        });
        return state;
      });
    }
    return state;
  }
}

