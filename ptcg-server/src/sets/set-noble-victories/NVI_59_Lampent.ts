import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, PokemonCardList, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Lampent extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Litwick';
  public cardType: CardType = CardType.PSYCHIC;
  public hp: number = 80;
  public weakness = [{ type: CardType.DARK }];
  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Luring Light',
    cost: [CardType.COLORLESS],
    damage: 0,
    text: 'Switch the Defending Pokémon with 1 of your opponent\'s Benched Pokémon.'
  },
  {
    name: 'Will-O-Wisp',
    cost: [CardType.PSYCHIC, CardType.COLORLESS],
    damage: 30,
    text: ''
  }];

  public set: string = 'NVI';
  public name: string = 'Lampent';
  public fullName: string = 'Lampent NVI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '59';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const opponentHasBench = opponent.bench.some(b => b.cards.length > 0);

      if (!opponentHasBench) {
        return state;
      }

      let targets: PokemonCardList[] = [];
      if (opponentHasBench) {
        return store.prompt(state, new ChoosePokemonPrompt(
          opponent.id,
          GameMessage.CHOOSE_POKEMON_TO_SWITCH,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH],
          { allowCancel: false }
        ), results => {
          targets = results || [];
          if (targets.length > 0) {
            opponent.active.clearEffects();
            opponent.switchPokemon(targets[0]);
          }
        });
      }
    }

    return state;
  }
}