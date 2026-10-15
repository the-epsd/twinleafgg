import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { AttachEnergyPrompt, ConfirmPrompt, GameMessage, PlayerType, PowerType, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CONFIRMATION_PROMPT, IS_POKEPOWER_BLOCKED, JUST_EVOLVED, MOVE_CARDS, THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Arcanine extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Growlithe';
  public hp: number = 100;
  public cardType: CardType[] = [R];
  public weakness = [{ type: W, value: +30 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Flame Dash',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn, when you play Arcanine from your hand to evolve 1 of your Benched Pokémon, you may switch Arcanine with 1 of your Active Pokémon. If you do, you may move any number of Energy cards attached to that Pokémon to Arcanine.'
  }];

  public attacks = [{
    name: 'Inferno Onrush',
    cost: [R, R, C, C],
    damage: 120,
    text: 'Arcanine does 40 damage to itself.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '22';
  public name: string = 'Arcanine';
  public fullName: string = 'Arcanine SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Flame Dash
    if (JUST_EVOLVED(effect, this) && !IS_POKEPOWER_BLOCKED(store, state, effect.player, this)) {
      const player = effect.player;
      if (effect.target === player.active) {
        return state;
      }

      CONFIRMATION_PROMPT(store, state, player, wantToUse => {
        if (!wantToUse) {
          return;
        }

        const benchSlot = effect.target;
        const previousActive = player.active;
        player.switchPokemon(benchSlot);

        const hasEnergy = previousActive.cards.some(c => c.superType === SuperType.ENERGY);
        if (!hasEnergy) {
          return;
        }

        store.prompt(state, new ConfirmPrompt(
          player.id,
          GameMessage.WANT_TO_USE_ABILITY
        ), wantToMove => {
          if (!wantToMove) {
            return;
          }

          store.prompt(state, new AttachEnergyPrompt(
            player.id,
            GameMessage.MOVE_ENERGY_CARDS,
            previousActive,
            PlayerType.BOTTOM_PLAYER,
            [SlotType.ACTIVE],
            { superType: SuperType.ENERGY },
            { allowCancel: true, min: 0 }
          ), transfers => {
            transfers = transfers || [];
            for (const transfer of transfers) {
              const target = StateUtils.getTarget(state, player, transfer.to);
              MOVE_CARDS(store, state, previousActive, target, { cards: [transfer.card], sourceCard: this });
            }
          });
        });
      }, GameMessage.WANT_TO_USE_ABILITY);
    }

    // Inferno Onrush
    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 40);
    }

    return state;
  }
}
