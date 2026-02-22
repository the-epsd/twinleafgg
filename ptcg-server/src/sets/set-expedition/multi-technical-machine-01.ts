import { Attack, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType } from '../../game';
import { CardTag, CardType, TrainerType } from '../../game/store/card/card-types';
import { ColorlessCostReducer } from '../../game/store/card/pokemon-interface';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CheckAttackCostEffect, CheckPokemonAttacksEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED } from '../../game/store/prefabs/attack-effects';
import { WAS_TRAINER_USED } from '../../game/store/prefabs/trainer-prefabs';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class MultiTechnicalMachine01 extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;
  public tags = [CardTag.TECHNICAL_MACHINE];
  public set: string = 'EX';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '144';
  public name: string = 'Multi Technical Machine 01';
  public fullName: string = 'Multi Technical Machine 01 EX';

  public attacks: Attack[] = [{
    name: 'Paralyzing Gaze',
    cost: [C],
    damage: 0,
    text: 'The Defending Pokémon is now Paralyzed.'
  }];

  public text: string =
    'Attach this card to 1 of your Pokémon in play. That Pokémon may use this card\'s attack instead of its own. At the end of your turn, discard Multi Technical Machine 01.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      state = store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_ATTACH_CARDS,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
        { min: 1, max: 1, allowCancel: false },
      ), transfers => {
        player.supporter.moveCardTo(effect.trainerCard, transfers[0]);
      });
    }

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, index) => {
        if (cardList.cards.includes(this)) {
          cardList.moveCardTo(this, player.discard);

        }
      });
    }

    if (effect instanceof CheckAttackCostEffect && effect.attack === this.attacks[0]) {
      const pokemonCard = effect.player.active.getPokemonCard();
      if (pokemonCard && 'getColorlessReduction' in pokemonCard) {
        const reduction = (pokemonCard as ColorlessCostReducer).getColorlessReduction(state);
        for (let i = 0; i < reduction && effect.cost.includes(CardType.COLORLESS); i++) {
          const index = effect.cost.indexOf(CardType.COLORLESS);
          if (index !== -1) {
            effect.cost.splice(index, 1);
          }
        }
      }
    }

    if (effect instanceof CheckPokemonAttacksEffect && effect.player.active.cards.includes(this) &&
      !effect.attacks.includes(this.attacks[0])) {
      effect.attacks.push(this.attacks[0]);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
    }

    return state;
  }
}