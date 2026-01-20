import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike, State, GameMessage, GameError, StateUtils, ChoosePokemonPrompt, PlayerType, SlotType, PokemonCardList } from '../../game';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { CheckPokemonPowersEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { CONFIRMATION_PROMPT, IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE } from '../../game/store/prefabs/attack-effects';

export class Ursaring extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Teddiursa';
  public cardType: CardType = C;
  public hp: number = 80;
  public retreat = [C, C];
  public weakness = [{ type: F }];

  public powers = [{
    name: 'Intimidating Ring',
    powerType: PowerType.POKEBODY,
    text: 'As long as Ursaring is your Active Pokémon, your opponent\'s Basic Pokémon can\'t attack or use any Poké-Powers.'
  }];

  public attacks = [
    {
      name: 'Drag Off',
      cost: [C, C],
      damage: 20,
      text: 'Before doing damage, you may switch 1 of your opponent\'s Benched Pokémon with the Defending Pokémon. If you do, this attack does 20 damage to the new Defending Pokémon. Your opponent chooses the Defending Pokémon to switch.'
    },
    {
      name: 'Rock Smash',
      cost: [C, C, C],
      damage: 40,
      damageCalculation: '+',
      text: 'Flip a coin. If heads, this attack does 40 damage plus 20 more damage.'
    }
  ];

  public set: string = 'UF';
  public name: string = 'Ursaring';
  public fullName: string = 'Ursaring UF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '18';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Block attacks from basics when active
    if (effect instanceof AttackEffect && effect.source.getPokemonCard()?.stage === Stage.BASIC) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_POKEBODY_BLOCKED(store, state, opponent, this)) {
        return state;
      }

      if (opponent.active.getPokemonCard() === this) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }

    // Block Poké-Powers from basics when active
    if (effect instanceof CheckPokemonPowersEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_POKEBODY_BLOCKED(store, state, opponent, this)) {
        return state;
      }

      // Only filter opponent's Basic Pokémon
      const targetOwner = StateUtils.findOwner(state, effect.target);
      if (targetOwner === player) {
        return state;
      }

      if (opponent.active.getPokemonCard() === this) {
        const targetPokemon = effect.target.getPokemonCard();
        if (targetPokemon) {
          const cardList = effect.target;
          const isBasic = cardList instanceof PokemonCardList && (cardList.getPokemons().length === 1 || targetPokemon.tags.includes(CardTag.LEGEND));
          if (isBasic) {
            // Filter out Poké Powers
            effect.powers = effect.powers.filter(power =>
              power.powerType !== PowerType.POKEPOWER
            );
          }
        }
      }
    }

    if (effect instanceof PowerEffect && effect.power.powerType === PowerType.POKEPOWER) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_POKEBODY_BLOCKED(store, state, opponent, this)) {
        return state;
      }

      let effectCardList: PokemonCardList | undefined;
      player.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (card === effect.card) {
          effectCardList = cardList;
        }
      });

      if ((effectCardList?.getPokemons().length === 1 || effect.card.tags.includes(CardTag.LEGEND)) && opponent.active.getPokemonCard() === this) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }

    // Drag Off
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const bench = opponent.bench.filter(bench => bench.cards.length > 0);

      if (bench.length === 0) {
        return state;
      }

      CONFIRMATION_PROMPT(store, state, player, result => {
        if (result) {
          store.prompt(state, new ChoosePokemonPrompt(
            player.id,
            GameMessage.CHOOSE_POKEMON_TO_SWITCH,
            PlayerType.TOP_PLAYER,
            [SlotType.BENCH],
            { allowCancel: false }
          ), result => {
            const cardList = result[0];
            opponent.switchPokemon(cardList);
          });
        }
      }, GameMessage.WANT_TO_SWITCH_POKEMON);
    }

    // Rock Smash
    if (WAS_ATTACK_USED(effect, 1, this)) {
      FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 20);
    }

    return state;
  }

}
