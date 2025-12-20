import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, PlayerType, ChoosePokemonPrompt, GameMessage, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { MOVE_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class MGardevoirEx extends PokemonCard {
  public tags = [CardTag.POKEMON_EX, CardTag.MEGA];
  public stage: Stage = Stage.MEGA;
  public evolvesFrom = 'Gardevoir-EX';
  public cardType: CardType = Y;
  public additionalCardTypes = [P];
  public hp: number = 210;
  public weakness = [{ type: M }];
  public resistance = [{ type: D, value: -20 }];
  public retreat = [C, C];

  public powers = [
    {
      name: 'Mega Evolution Rule',
      powerType: PowerType.MEGA_EVOLUTION_RULE,
      text: 'When 1 of your Pokémon becomes a Mega Evolution Pokémon, your turn ends.'
    }
  ];

  public attacks = [
    {
      name: 'Despair Ray',
      cost: [Y, C],
      damage: 110,
      damageCalculation: '+',
      text: 'Discard as many of your Benched Pokémon as you like. This attack does 10 more damage for each Benched Pokémon you discarded in this way.'
    }
  ];

  public set: string = 'STS';
  public name: string = 'M Gardevoir-EX';
  public fullName: string = 'M Gardevoir-EX STS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '79';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // screw the rules
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      if (effect.target.tools.length > 0 && effect.target.tools[0].name === 'Gardevoir Spirit Link') {
        return state;
      }

      const endTurnEffect = new EndTurnEffect(effect.player);
      store.reduceEffect(state, endTurnEffect);
    }

    // Despair Ray
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      // Player has more Pokemons than bench size, discard some
      const count = player.bench.length;
      store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DISCARD,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { min: 0, max: count, allowCancel: false }
      ), results => {
        results = results || [];

        let discardCount = 0;

        // Discard all selected Pokemon
        for (let i = player.bench.length - 1; i >= 0; i--) {
          if (results.includes(player.bench[i])) {
            const cardList = player.bench[i];
            const pokemons = cardList.getPokemons();
            const otherCards = cardList.cards.filter(card =>
              !(card instanceof PokemonCard) &&
              !pokemons.includes(card as PokemonCard) &&
              (!cardList.tools || !cardList.tools.includes(card))
            );
            const tools = [...cardList.tools];

            // Move other cards (tools, energy, etc.) to discard
            if (otherCards.length > 0) {
              MOVE_CARDS(store, state, cardList, player.discard, { cards: otherCards });
            }

            // Move tools to discard
            if (tools.length > 0) {
              for (const tool of tools) {
                cardList.moveCardTo(tool, player.discard);
              }
            }

            // Move Pokémon to discard and clear their effects
            if (pokemons.length > 0) {
              cardList.damage = 0;
              cardList.clearEffects();
              MOVE_CARDS(store, state, cardList, player.discard, { cards: pokemons });
            }
            discardCount++;
          }
        }

        effect.damage += (10 * discardCount);
      });
    }

    return state;
  }

}
