import { Attack, Card, CardManager, CardTarget, ChooseCardsPrompt, ChoosePokemonPrompt, GameError, GameMessage, PlayerType, PokemonCard, PokemonCardList, SlotType } from '../../game';
import { CardType, Stage, SuperType, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CheckPokemonAttacksEffect, CheckPokemonPlayedTurnEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, EvolveEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class TechnicalMachineEvolution extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public regulationMark = 'G';

  public tags = [ ];

  public set: string = 'PAR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '178';

  public name: string = 'Technical Machine: Evolution';

  public fullName: string = 'Technical Machine: Evolution PAR';

  public attacks: Attack[] = [{
    name: 'Evolution',
    cost: [ CardType.COLORLESS ],
    damage: 0,
    text: 'Choose up to 2 of your Benched Pokémon. For each of those Pokémon, search your deck for a card that evolves from that Pokémon and put it onto that Pokémon to evolve it. Then, shuffle your deck.' 
  }];
  
  public text: string =
    'The Pokémon this card is attached to can use the attack on this card. (You still need the necessary Energy to use this attack.) If this card is attached to 1 of your Pokémon, discard it at the end of your turn.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckPokemonAttacksEffect && effect.player.active.getPokemonCard()?.tools.includes(this) &&
!effect.attacks.includes(this.attacks[0])) {
      effect.attacks.push(this.attacks[0]);
    }

    function isMatchingStage2(stage1: PokemonCard[], basic: PokemonCard, stage2: PokemonCard): boolean {
      for (const card of stage1) {
        if (card.name === stage2.evolvesFrom && basic.name === card.evolvesFrom) {
          return true;
        }
      }
      return false;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;


      
      // Create list of non - Pokemon SP slots
      const blocked: CardTarget[] = [];
      let hasBasicPokemon: boolean = false;
      
      const stage2 = player.deck.cards.filter(c => {
        return c instanceof PokemonCard && c.stage === Stage.STAGE_2;
      }) as PokemonCard[];
      
      //   if (stage2.length === 0) {
      //     throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      //   }
      
      // Look through all known cards to find out if it's a valid Stage 2
      const cm = CardManager.getInstance();
      const stage1 = cm.getAllCards().filter(c => {
        return c instanceof PokemonCard && c.stage === Stage.STAGE_1;
      }) as PokemonCard[];
      
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        if (card.stage === Stage.BASIC && stage2.some(s => isMatchingStage2(stage1, card, s))) {
          const playedTurnEffect = new CheckPokemonPlayedTurnEffect(player, list);
          store.reduceEffect(state, playedTurnEffect);
          if (playedTurnEffect.pokemonPlayedTurn < state.turn) {
            hasBasicPokemon = true;
            return;
          }
          if (playedTurnEffect.pokemonPlayedTurn > state.turn) {
            hasBasicPokemon = true;
            return;
          }
          if (playedTurnEffect.pokemonPlayedTurn == state.turn) {
            hasBasicPokemon = true;
            return;
          }
        }
        blocked.push(target);
      });
      
      if (!hasBasicPokemon) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
      
      let targets: PokemonCardList[] = [];
      store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_EVOLVE,
        PlayerType.BOTTOM_PLAYER,
        [ SlotType.BENCH ],
        { allowCancel: true, blocked }
      ), selection => {
        targets = selection || [];
      });
      
      if (targets.length === 0) {
        return state; // canceled by user
      }
      const pokemonCard = targets[0].getPokemonCard();
      if (pokemonCard === undefined) {
        throw new GameError(GameMessage.CANNOT_USE_ATTACK);
      }
      
      const blocked2: number[] = [];
      player.deck.cards.forEach((c, index) => {
        if (c instanceof PokemonCard && c.stage === Stage.STAGE_2) {
          if (!isMatchingStage2(stage1, pokemonCard, c)) {
            blocked2.push(index);
          }
        }
      });
      
      let cards: Card[] = [];
      return store.prompt(state, new ChooseCardsPrompt(
        player.id,
        GameMessage.CHOOSE_CARD_TO_EVOLVE,
        player.deck,
        { superType: SuperType.POKEMON, stage: Stage.STAGE_2 },
        { allowCancel: true, blocked: blocked2 }
      ), selected => {
        cards = selected || [];
      
        if (cards.length > 0) {
          const pokemonCard = cards[0] as PokemonCard;
          const evolveEffect = new EvolveEffect(player, targets[0], pokemonCard);
          store.reduceEffect(state, evolveEffect);
        }
      });
    }

    if (effect instanceof EndTurnEffect && effect.player.active.tool) {
      const player = effect.player;
      const tool = effect.player.active.tool;
      if (tool.name === this.name) {
        player.active.moveCardTo(tool, player.discard);
        player.active.tool = undefined;
      }

      return state;
    }

    return state;
  }

}

