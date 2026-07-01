import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { GameMessage, PlayerType, PowerType, SlotType, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { ChoosePokemonPrompt } from '../../../game/store/prompts/choose-pokemon-prompt';
import { ConfirmPrompt } from '../../../game/store/prompts/confirm-prompt';
import { HealEffect } from '../../../game/store/effects/game-effects';
import { PlayPokemonEffect } from '../../../game/store/effects/play-card-effects';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Primarina extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Brionne';
  public cardType: CardType = CardType.WATER;
  public hp: number = 150;
  public weakness = [{ type: CardType.LIGHTNING }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Max Melody',
    powerType: PowerType.ABILITY,
    text: 'You may use this Ability once during your turn when you play this card from your hand to evolve 1 of your Pokémon. Heal all damage from 1 of your Pokémon.',
  }];

  public attacks = [{
    name: 'Aqua Return',
    cost: [CardType.WATER, CardType.COLORLESS],
    damage: 120,
    text: 'Return this Pokémon and all cards attached to it into your hand.',
  }];

  public set: string = 'M5';
  public setNumber: string = '19';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Primarina';
  public fullName: string = 'Primarina M5';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-evolving-skies/ludicolo.ts (on-evolve PlayPokemonEffect), set-unbroken-bonds/dedenne-gx.ts (return to hand)
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      state = store.prompt(state, new ConfirmPrompt(
        player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (!wantToUse) {
          return;
        }
        store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_HEAL,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { allowCancel: false, min: 1, max: 1 },
        ), picked => {
          if (!picked || picked.length === 0) {
            return;
          }
          const target = picked[0];
          if (target.damage > 0) {
            store.reduceEffect(state, new HealEffect(player, target, target.damage));
          }
        });
      });

      return state;
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_PICK_UP,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE],
        { allowCancel: false },
      ), result => {
        const cardList = result?.length ? result[0] : null;
        if (!cardList) {
          return;
        }
        const pokemons = cardList.getPokemons();
        cardList.moveCardsTo(pokemons, player.hand);
        cardList.moveTo(player.hand);
        cardList.clearEffects();
      });
    }

    return state;
  }
}
