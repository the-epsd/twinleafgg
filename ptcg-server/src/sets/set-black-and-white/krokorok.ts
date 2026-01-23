import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { Attack } from '../../game/store/card/pokemon-types';
import { StoreLike, State, StateUtils, ChooseAttackPrompt, GameMessage, GameLog, PokemonCardList, GameError } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Krokorok extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Sandile';
  public cardType: CardType = F;
  public hp: number = 90;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Torment',
      cost: [C, C],
      damage: 30,
      text: 'Choose 1 of the Defending Pokemon\'s attacks. That Pokemon can\'t use that attack during your opponent\'s next turn.'
    },
    {
      name: 'Bite',
      cost: [F, C, C],
      damage: 50,
      text: ''
    }
  ];

  public set: string = 'BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '64';
  public name: string = 'Krokorok';
  public fullName: string = 'Krokorok BLW';

  public TORMENT_ATTACK: Attack | undefined;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const pokemonCard = opponent.active.getPokemonCard();

      if (pokemonCard === undefined || pokemonCard.attacks.length === 0) {
        return state;
      }

      store.prompt(state, new ChooseAttackPrompt(
        player.id,
        GameMessage.CHOOSE_ATTACK_TO_DISABLE,
        [pokemonCard],
        { allowCancel: false }
      ), result => {
        if (!result) {
          return state;
        }

        this.TORMENT_ATTACK = result;
        const attackName = result.name;

        store.log(state, GameLog.LOG_PLAYER_DISABLES_ATTACK, {
          name: player.name,
          attack: attackName
        });

        opponent.active.marker.addMarker(PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER, this);

        return state;
      });

      return state;
    }

    // Block the disabled attack
    if (effect instanceof AttackEffect && effect.player.active.marker.hasMarker(PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER, this)) {
      if (effect.attack === this.TORMENT_ATTACK) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }

    // Clean up marker at end of turn
    if (effect instanceof EndTurnEffect && effect.player.active.marker.hasMarker(PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER, this)) {
      effect.player.active.marker.removeMarker(PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER, this);
      this.TORMENT_ATTACK = undefined;
    }

    return state;
  }
}
