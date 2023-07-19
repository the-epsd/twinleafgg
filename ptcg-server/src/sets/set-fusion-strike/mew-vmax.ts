import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameError, GameMessage,
  PlayerType, ChooseAttackPrompt, Player } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, UseAttackEffect } from '../../game/store/effects/game-effects';
import { ApplyWeaknessEffect, AfterDamageEffect } from '../../game/store/effects/attack-effects';

export class MewVMAX extends PokemonCard {

  public tags = [ CardTag.POKEMON_VMAX, CardTag.FUSION_STRIKE ];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 310;

  public weakness = [{ type: CardType.DARK }];

  public retreat = [ ];

  public attacks = [{
    name: 'Cross Fusion Strike',
    cost: [ CardType.COLORLESS, CardType.COLORLESS ],
    damage: 0,
    text: 'This Pokemon can use the attacks of any Pokemon in play ' +
      '(both yours and your opponent\'s). (You still need the necessary ' +
      'Energy to use each attack.)'
  },
  {
    name: 'Max Miracle',
    cost: [ CardType.PSYCHIC, CardType.PSYCHIC ],
    damage: 130,
    text: 'This attack\'s damage isn\'t affected by any effects on your ' +
        'Opponent\'s Active Pokémon.'
  }
  ];

  public set: string = 'FST';

  public name: string = 'Mew VMAX';

  public fullName: string = 'Mew VMAX FST 114';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const pokemonCard = player.active.getPokemonCard();

      if (pokemonCard !== this) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      // Build cards and blocked for Choose Attack prompt
      const { pokemonCards, blocked } = this.buildAttackList(state, store, player);

      // No attacks to copy
      if (pokemonCards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      return store.prompt(state, new ChooseAttackPrompt(
        player.id,
        GameMessage.CHOOSE_ATTACK_TO_COPY,
        pokemonCards,
        { allowCancel: true, blocked }
      ), attack => {
        if (attack !== null) {
          const useAttackEffect = new UseAttackEffect(player, attack);
          store.reduceEffect(state, useAttackEffect);
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
  
      const applyWeakness = new ApplyWeaknessEffect(effect, 130);
      store.reduceEffect(state, applyWeakness);
      const damage = applyWeakness.damage;
  
      effect.damage = 0;
  
      if (damage > 0) {
        opponent.active.damage += damage;
        const afterDamage = new AfterDamageEffect(effect, damage);
        state = store.reduceEffect(state, afterDamage);
      }
    }
    

    return state;
  }

  private buildAttackList(
    state: State, store: StoreLike, player: Player
  ): { pokemonCards: PokemonCard[], blocked: { index: number, attack: string }[] } {

    const pokemonCards: PokemonCard[] = [];
    const blocked: { index: number, attack: string }[] = [];
    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
      this.checkAttack(state, store, player, card, pokemonCards, blocked);
    });

    return { pokemonCards, blocked };
  }

  private checkAttack(state: State, store: StoreLike, player: Player,
    card: PokemonCard, pokemonCards: PokemonCard[],
    blocked: { index: number, attack: string }[]
  ) {
    {
      // Only include Pokemon V cards
      if (!card.tags.includes(CardTag.FUSION_STRIKE)) {
        return;
      }
      // No need to include this Mew VMAX to the list
      if (card === this) {
        return;
      }

      const attacks = card.attacks.filter(attack => {
      });
      const index = pokemonCards.length;
      pokemonCards.push(card);
      card.attacks.forEach(attack => {
        if (!attacks.includes(attack)) {
          blocked.push({ index, attack: attack.name });
        }
      });
    }
  }
}
