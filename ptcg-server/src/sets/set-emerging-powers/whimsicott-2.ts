import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameMessage, GameError, PlayerType, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { ChooseAttackPrompt } from '../../game/store/prompts/choose-attack-prompt';

export class Whimsicott2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Cottonee';
  public cardType: CardType = G;
  public hp: number = 80;
  public weakness = [{ type: R }];
  public resistance = [{ type: W, value: -20 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Encore',
      cost: [C],
      damage: 20,
      text: 'Choose 1 of the Defending Pokémon\'s attacks. During your opponent\'s next turn, that Pokémon can only use that attack.'
    },
    {
      name: 'U-turn',
      cost: [G, G],
      damage: 40,
      text: 'Switch this Pokémon with 1 of your Benched Pokémon.'
    }
  ];

  public set: string = 'EPO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '12';
  public name: string = 'Whimsicott';
  public fullName: string = 'Whimsicott EPO 12';

  public readonly ENCORE_MARKER = 'ENCORE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const defendingPokemon = opponent.active.getPokemonCard();

      if (defendingPokemon && defendingPokemon.attacks.length > 0) {
        return store.prompt(state, new ChooseAttackPrompt(
          player.id,
          GameMessage.CHOOSE_ATTACK_TO_COPY,
          [defendingPokemon],
          { allowCancel: false }
        ), chosenAttack => {
          if (chosenAttack) {
            opponent.active.marker.addMarker(this.ENCORE_MARKER + ':' + chosenAttack.name, this);
          }
        });
      }
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const hasBench = player.bench.some(b => b.cards.length > 0);

      if (hasBench) {
        return store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_SWITCH,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH],
          { allowCancel: false }
        ), targets => {
          const target = targets[0];
          player.switchPokemon(target);
        });
      }
    }

    // Encore effect - restrict attacks
    if (effect instanceof AttackEffect) {
      const player = effect.player;
      const markers = player.active.marker.markers.filter(m => m.name.startsWith(this.ENCORE_MARKER + ':'));
      if (markers.length > 0) {
        const allowedAttack = markers[0].name.replace(this.ENCORE_MARKER + ':', '');
        if (effect.attack.name !== allowedAttack) {
          throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
        }
      }
    }

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const markers = opponent.active.marker.markers.filter(m => m.name.startsWith(this.ENCORE_MARKER + ':'));
      markers.forEach(m => opponent.active.marker.removeMarker(m.name, this));
    }

    return state;
  }
}
