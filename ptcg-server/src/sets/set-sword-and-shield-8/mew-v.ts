import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, PowerType, ChoosePokemonPrompt,
  PlayerType, SlotType, GameMessage, Card, ChooseCardsPrompt, ShuffleDeckPrompt } from '../../game';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { CheckProvidedEnergyEffect, CheckTableStateEffect } from '../../game/store/effects/check-effects';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { PlayerType, SlotType } from '../../game';

export class MewV extends PokemonCard {

function* useEnergyMix(next: Function, store: StoreLike, state: State,
  effect: AttackEffect): IterableIterator<State> {

  const player = effect.player;

  if (player.deck.cards.length === 0) {
    return state;
  }

  const hasBenched = player.bench.some(b => b.cards.length > 0);
  if (!hasBenched) {
    return state;
  }

  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player.id,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.deck,
    { superType: SuperType.ENERGY },
    { min: 1, max: 1, allowCancel: true }
  ), selected => {
    cards = selected || [];
    next();
  });

  if (cards.length > 0) {
    yield store.prompt(state, new ChoosePokemonPrompt(
      player.id,
      GameMessage.CHOOSE_POKEMON_TO_ATTACH_CARDS,
      PlayerType.BOTTOM_PLAYER,
      CardTag.FUSION_STRIKE
      [ SlotType.ACTIVE, SlotType.BENCH ],
      { allowCancel: true }
    ), targets => {
      if (!targets || targets.length === 0) {
        return;
      }
      const target = targets[0];
      player.deck.moveCardsTo(cards, target);
      next();
    });
  }

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });

  function* usePsychicLeap(next: Function, store: StoreLike, state: State,
    effect: AttackEffect): IterableIterator<State> {
  
    const player = effect.player;
  
    return store.prompt(state, new ChoosePokemonPrompt(
      player.id,
      GameMessage.CHOOSE_POKEMON_TO_PICK_UP,
      PlayerType.BOTTOM_PLAYER,
      [ SlotType.ACTIVE ],
      { allowCancel: true }
    ), result => {
      const targets = result || [];

      // Operation cancelled by user
      if (targets.length === 0) {
        return;
      }

      targets.forEach(target => {
        target.moveTo(player.deck);
        return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
        });
      }


export class MewV extends PokemonCard {

  public tags = [ CardTag.POKEMON_V ];

  public tags = [ CardTag.FUSION_STRIKE ];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 180;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [  ];

  public attacks = [
    {
      name: 'Energy Mix',
      cost: [ CardType.GRASS, CardType.COLORLESS ],
      damage: 0,
      text: 'Search your deck for an Energy card and attach it to 1 of ' +
        'your Fusion Strike Pokémon. Then, shuffle your deck. '
    }
    {
      name: 'Psychic Leap',
      cost: [ CardType.PSYCHIC, CardType.COLORLESS ],
      damage: 70,
      text: 'You may shuffle this Pokémon and all attached cards into ' +
        'your deck. '
    }
  ];

  public set: string = 'SSH8';

  public name: string = 'Mew V';

  public fullName: string = 'Mew V FST 250';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    }

    return state;
  }

}
