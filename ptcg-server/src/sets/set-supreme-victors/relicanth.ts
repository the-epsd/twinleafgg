import { Attack, ChooseAttackPrompt, GameError, GameLog, GameMessage, PlayerType, PokemonCardList, StateUtils, TrainerCard } from '../../game';
import { CardType, Stage, TrainerType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON } from '../../game/store/prefabs/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class Relicanth extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 80;
  public weakness = [{ type: G, value: +20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Grand Swell',
    cost: [F],
    damage: 0,
    text: 'Choose 1 of your opponent\'s Pokémon. This attack does 30 damage to that Pokémon for each Pokémon Tool and Stadium card your opponent has in play. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  },
  {
    name: 'Amnesia',
    cost: [F, C],
    damage: 30,
    text: 'Choose 1 of the Defending Pokémon\'s attacks. That Pokémon can\'t use that attack during your opponent\'s next turn.'
  }];

  public set: string = 'SV';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '79';
  public name: string = 'Relicanth';
  public fullName: string = 'Relicanth SV';

  public MEMORY_SKIPPED_ATTACK: Attack | undefined;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      let attackDamage = 0;
      const stadiumCard = StateUtils.getStadiumCard(state);
      if (stadiumCard) {
        const cardList = StateUtils.findCardList(state, stadiumCard);
        const stadiumOwner = StateUtils.findOwner(state, cardList);
        if (stadiumOwner === effect.opponent) {
          attackDamage += 30;
        }
      }

      effect.opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        cardList.cards.forEach(card => {
          if (card instanceof TrainerCard && card.trainerType === TrainerType.TOOL) {
            attackDamage += 30;
          }
        });
      });

      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(attackDamage, effect, store, state);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
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
        result;

        if (!result) {
          return state;
        }

        this.MEMORY_SKIPPED_ATTACK = result;

        store.log(state, GameLog.LOG_PLAYER_DISABLES_ATTACK, {
          name: player.name,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          attack: this.MEMORY_SKIPPED_ATTACK!.name
        });

        opponent.active.marker.addMarker(PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER, this);

        return state;
      });

      return state;
    }

    if (effect instanceof AttackEffect && effect.player.active.marker.hasMarker(PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER, this)) {
      if (effect.attack === this.MEMORY_SKIPPED_ATTACK) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }

    if (effect instanceof EndTurnEffect && effect.player.active.marker.hasMarker(PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER, this)) {
      effect.player.marker.removeMarker(PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER, this);
      this.MEMORY_SKIPPED_ATTACK = undefined;
    }

    return state;
  }
}
