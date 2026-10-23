import { CardTarget, CardType, EnergyType, PlayerType, PokemonCard, SlotType, Stage, State, StoreLike } from '../../../game';
import { CheckPokemonTypeEffect } from '../../../game/store/effects/check-effects';
import { Effect } from '../../../game/store/effects/effect';
import { ATTACH_ENERGY_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Drampa extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 130;
  public cardType: CardType[] = [N];
  public weakness = [];
  public resistance = [];
  public retreat = [C, C];

  public attacks = [{
    name: 'Powerful Breath',
    cost: [F],
    damage: 30,
    text: 'Search your deck for a Basic Energy card and attach it to 1 of your [N] Pokémon. Then, shuffle your deck.'
  },
  {
    name: 'Reserve Strength',
    cost: [W, F, C],
    damage: 150,
    text: 'During your next turn, this Pokémon can\'t attack.'
  }];

  public regulationMark: string = 'J';
  public set: string = 'M7';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '68';
  public name: string = 'Drampa';
  public fullName: string = 'Drampa FLO';
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Powerful Breath
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const blockedTo: CardTarget[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, _card, target) => {
        const checkType = new CheckPokemonTypeEffect(cardList);
        store.reduceEffect(state, checkType);
        if (!checkType.cardTypes.includes(CardType.DRAGON)) {
          blockedTo.push(target);
        }
      });

      return ATTACH_ENERGY_PROMPT(
        store,
        state,
        player,
        PlayerType.BOTTOM_PLAYER,
        SlotType.DECK,
        [SlotType.ACTIVE, SlotType.BENCH],
        { energyType: EnergyType.BASIC },
        { min: 0, max: 1, allowCancel: true, blockedTo }
      );
    }

    // Reserve Strength
    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.player.active.cannotAttackNextTurnPending = true;
    }

    return state;
  }
}
