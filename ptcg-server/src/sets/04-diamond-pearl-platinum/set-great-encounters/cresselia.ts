import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { ChooseCardsPrompt, ChoosePokemonPrompt, EnergyCard, GameMessage, PlayerType, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DiscardCardsEffect } from '../../../game/store/effects/attack-effects';
import { HealEffect } from '../../../game/store/effects/game-effects';
import { CONFIRMATION_PROMPT, HEAL_X_DAMAGE_FROM_THIS_POKEMON, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Cresselia extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 80;
  public cardType: CardType[] = [P];
  public weakness = [{ type: P, value: +20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Moon Twinkle',
    cost: [C],
    damage: 10,
    text: 'If there is any Stadium card in play, remove 2 damage counters from Cresselia.'
  },
  {
    name: 'Lunar Dance',
    cost: [P, P, C],
    damage: 50,
    text: 'You may discard 2 Energy attached to Cresselia. If you do, remove all damage counters from 1 of your Benched Pokémon.'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '2';
  public name: string = 'Cresselia';
  public fullName: string = 'Cresselia GE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Moon Twinkle
    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (StateUtils.getStadiumCard(state) !== undefined) {
        HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 20);
      }
    }

    // Lunar Dance
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const energies = player.active.cards.filter(c => c instanceof EnergyCard);
      const hasBenchDamage = player.bench.some(b => b.cards.length > 0 && b.damage > 0);
      if (energies.length < 2 || !hasBenchDamage) {
        return state;
      }

      return CONFIRMATION_PROMPT(store, state, player, wantTo => {
        if (!wantTo) {
          return;
        }
        store.prompt(state, new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_DISCARD,
          player.active,
          { superType: SuperType.ENERGY },
          { min: 2, max: 2, allowCancel: false }
        ), selected => {
          const cards = selected || [];
          if (cards.length !== 2) {
            return;
          }
          const discardEnergy = new DiscardCardsEffect(effect, cards);
          discardEnergy.target = player.active;
          store.reduceEffect(state, discardEnergy);

          store.prompt(state, new ChoosePokemonPrompt(
            player.id,
            GameMessage.CHOOSE_POKEMON_TO_HEAL,
            PlayerType.BOTTOM_PLAYER,
            [SlotType.BENCH],
            { min: 1, max: 1, allowCancel: false }
          ), targets => {
            if (!targets || targets.length === 0) {
              return;
            }
            const healEffect = new HealEffect(player, targets[0], targets[0].damage);
            store.reduceEffect(state, healEffect);
          });
        });
      }, GameMessage.WANT_TO_USE_EFFECT_OF_ATTACK);
    }

    return state;
  }
}
