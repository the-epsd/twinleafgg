import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { CardTarget, ChoosePokemonPrompt, GameError, GameMessage, PlayerType, PokemonCardList, PowerType, SlotType, StateUtils } from '../../game';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

function* useChainsOfControl(next: Function, store: StoreLike, state: State,
  effect: PowerEffect): IterableIterator<State> {
  const player = effect.player;
  const hasBench = player.bench.some(b => b.cards.length > 0);

  if (player.chainsOfControlUsed == true) {
    throw new GameError(GameMessage.POWER_ALREADY_USED);
  }

  const blocked: CardTarget[] = [];
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card, target) => {
    if (card.name === 'Pecharunt ex') {
      blocked.push(target);
    }
  });
  
  if (hasBench === false) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }
  
  let target: PokemonCardList[] = [];
  yield store.prompt(state, new ChoosePokemonPrompt(
    player.id,
    GameMessage.CHOOSE_POKEMON_TO_SWITCH,
    PlayerType.BOTTOM_PLAYER,
    [ SlotType.BENCH ],
    { allowCancel: false, blocked }
  ), results => {
    target = results || [];
    next();
  });
  
  if (target.length > 0) {
    player.active.clearEffects();
    player.switchPokemon(target[0]);
    player.active.addSpecialCondition(SpecialCondition.POISONED);
    player.chainsOfControlUsed = true;
  }
}

export class Pecharuntex extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public tags = [ CardTag.POKEMON_ex ];

  public regulationMark = 'H';

  public cardType: CardType = CardType.DARK;

  public hp: number = 190;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [ CardType.COLORLESS ];

  public powers = [{
    name: 'Chains of Control',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Once during your turn, you may switch 1 of your Benched Darkness Pkmn (excl. Pecharunt ex) with your Active. Your new Active is now Poisoned. You can\'t use more than 1 Chains of Control Ability per turn.'
  }];

  public attacks = [{
    name: 'Irritating Burst',
    cost: [ CardType.DARK, CardType.DARK ],
    damage: 60,
    text: 'This attack does 60 damage for each Prize card your opponent has taken.'
  }];

  public set: string = 'SV6a';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '39';
  
  public name: string = 'Pecharunt ex';
  
  public fullName: string = 'Pecharunt ex SV6a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const generator = useChainsOfControl(() => generator.next(), store, state, effect);
      const player = effect.player;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === this) {
          cardList.addSpecialCondition(SpecialCondition.ABILITY_USED);
        }
      });
      return generator.next().value;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      
      const prizesTaken = 6 - opponent.getPrizeLeft();
      
      const damagePerPrize = 60;
      
      effect.damage = prizesTaken * damagePerPrize;
    }

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.chainsOfControlUsed == false;
    }
    return state;
  }
}

