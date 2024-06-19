import { Attack, CardManager, PlayerType, PokemonCard, StateUtils } from '../../game';
import { CardType, Stage, SuperType, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CheckPokemonAttacksEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { ToolEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class TechnicalMachineDevolution extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public regulationMark = 'G';

  public tags = [ ];

  public set: string = 'PAR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '177';

  public name: string = 'Technical Machine: Devolution';

  public fullName: string = 'Technical Machine: Devolution PAR';

  public attacks: Attack[] = [{
    name: 'Devolution',
    cost: [ CardType.COLORLESS ],
    damage: 0,
    text: 'Devolve each of your opponent\'s evolved Pokémon by putting the highest Stage Evolution card on it into your opponent\'s hand.' 
  }];
  
  public text: string =
    'The Pokémon this card is attached to can use the attack on this card. (You still need the necessary Energy to use this attack.) If this card is attached to 1 of your Pokémon, discard it at the end of your turn.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof EndTurnEffect && effect.player.active.tool) {
      const player = effect.player;
      const tool = effect.player.active.tool;

      try {
        const toolEffect = new ToolEffect(player, this);
        store.reduceEffect(state, toolEffect);
      } catch {
        return state;
      }

      if (tool.name === this.name) {
        player.active.moveCardTo(tool, player.discard);
        player.active.tool = undefined;
      }

      return state;
    }

    if (effect instanceof CheckPokemonAttacksEffect && effect.player.active.getPokemonCard()?.tools.includes(this) &&
!effect.attacks.includes(this.attacks[0])) {
      const player = effect.player;

      try {
        const toolEffect = new ToolEffect(player, this);
        store.reduceEffect(state, toolEffect);
      } catch {
        return state;
      }

      effect.attacks.push(this.attacks[0]);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      try {
        const toolEffect = new ToolEffect(player, this);
        store.reduceEffect(state, toolEffect);
      } catch {
        return state;
      }
    
      // Look through all known cards to find out if Pokemon can evolve
      const cm = CardManager.getInstance();
      const evolutions = cm.getAllCards().filter(c => {
        return c instanceof PokemonCard && c.stage !== Stage.BASIC;
      }) as PokemonCard[];

      // Build possible evolution card names
      const evolutionNames: string[] = [];
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (list, card, target) => {
        const valid = evolutions.filter(e => e.evolvesFrom === card.name);
        valid.forEach(c => {
          if (!evolutionNames.includes(c.name)) {
            evolutionNames.push(c.name);
          }
        });
      });

      if (opponent.active.getPokemonCard()) {
        const activePokemon = opponent.active.cards.filter(card => card.superType === SuperType.POKEMON);
        if (activePokemon.length > 0) {
          let lastPlayedPokemonIndex = activePokemon.length - 1;
          while (lastPlayedPokemonIndex >= 0 && activePokemon[lastPlayedPokemonIndex] instanceof PokemonCard && (activePokemon[lastPlayedPokemonIndex] as PokemonCard).stage === Stage.BASIC) {
            lastPlayedPokemonIndex--;
          }
          if (lastPlayedPokemonIndex >= 0) {
            const lastPlayedPokemon = activePokemon[lastPlayedPokemonIndex];
            opponent.active.moveCardTo(lastPlayedPokemon, opponent.hand);
          }
        }
      }
      

      opponent.bench.forEach(benchSpot => {
        if (benchSpot.getPokemonCard()) {
          const benchPokemon = benchSpot.cards.filter(card => card.superType === SuperType.POKEMON);
          if (benchPokemon.length > 0) {
            let lastPlayedPokemonIndex = benchPokemon.length - 1;
            while (lastPlayedPokemonIndex >= 0 && benchPokemon[lastPlayedPokemonIndex] instanceof PokemonCard && (benchPokemon[lastPlayedPokemonIndex] as PokemonCard).stage === Stage.BASIC) {
              lastPlayedPokemonIndex--;
            }
            if (lastPlayedPokemonIndex >= 0) {
              const lastPlayedPokemon = benchPokemon[lastPlayedPokemonIndex];
              benchSpot.moveCardTo(lastPlayedPokemon, opponent.hand);
            }
          }
        }
      });
      

    }
    
    return state;
  }
}