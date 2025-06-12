import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, Attack, StateUtils, ChooseAttackPrompt, GameMessage, GameLog, PokemonCardList, GameError } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class AurasLucario2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.AURAS];
  public cardType: CardType = M;
  public hp: number = 70;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Intimidation Wave',
    cost: [M],
    damage: 10,
    text: 'If the Defending Pokémon is a Basic Pokémon, choose 1 of the Defending Pokémon\'s attacks.That Pokémon can\'t use that attack during your opponent\'s next turn.'
  },
  {
    name: 'Bite',
    cost: [C, C, C],
    damage: 30,
    text: ''
  }];

  public set: string = 'PCGP';
  public name: string = 'Aura\'s Lucario';
  public fullName: string = 'Aura\'s Lucario PCGP 90';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '90';

  public DISABLED_ATTACK: Attack | undefined;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const pokemonCard = opponent.active.getPokemonCard();

      if (pokemonCard === undefined || pokemonCard.attacks.length === 0 || pokemonCard.stage !== Stage.BASIC) {
        return state;
      }

      store.prompt(state, new ChooseAttackPrompt(
        player.id,
        GameMessage.CHOOSE_ATTACK_TO_DISABLE,
        [pokemonCard],
        { allowCancel: false }
      ), result => {
        result;

        if (!result) {
          return state;
        }

        this.DISABLED_ATTACK = result;

        store.log(state, GameLog.LOG_PLAYER_DISABLES_ATTACK, {
          name: player.name,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          attack: this.DISABLED_ATTACK!.name
        });

        opponent.active.marker.addMarker(PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER, this);

        return state;
      });

      return state;
    }

    if (effect instanceof AttackEffect && effect.player.active.marker.hasMarker(PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER, this)) {
      if (effect.attack === this.DISABLED_ATTACK) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }

    if (effect instanceof EndTurnEffect && effect.player.active.marker.hasMarker(PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER, this)) {
      effect.player.marker.removeMarker(PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER, this);
      this.DISABLED_ATTACK = undefined;
    }

    return state;
  }
}