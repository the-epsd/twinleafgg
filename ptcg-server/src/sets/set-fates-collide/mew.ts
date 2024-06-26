import { ChooseAttackPrompt, ChooseCardsPrompt, GameError, GameLog, GameMessage, ShowCardsPrompt, StateUtils } from '../../game';
import { CardType, Stage, SuperType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Attack, PowerType } from '../../game/store/card/pokemon-types';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

function* useGenomeHacking(next: Function, store: StoreLike, state: State,
  effect: PowerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  
  const providedEnergyEffect = new CheckProvidedEnergyEffect(player, player.active);
  store.reduceEffect(state, providedEnergyEffect);

  const blocked: { index: number, attack: string }[] = [];
  
  player.bench.forEach((b, i) => {
    const pokemonCard = b.getPokemonCard();
    if (!pokemonCard || pokemonCard.stage !== Stage.BASIC) {
      return;
    }
    
    pokemonCard.attacks.forEach(attack => {
      if (!StateUtils.checkEnoughEnergy(providedEnergyEffect.energyMap, attack.cost)) {
        blocked.push({ index: i, attack: attack.name });
      }
    });
  });
  
  const benchedBasics = player.bench.map(b => b.getPokemonCard())
    .filter(b => !!b && b.stage === Stage.BASIC) as PokemonCard[];
  
  if (blocked.length === benchedBasics.reduce((sum, curr) => sum + curr.attacks.length, 0)) {
    throw new GameError(GameMessage.CANNOT_USE_POWER);
  }  

  let selected: any;
  yield store.prompt(state, new ChooseAttackPrompt(
    player.id,
    GameMessage.CHOOSE_ATTACK_TO_COPY,
    benchedBasics,
    { allowCancel: false, blocked }
  ), result => {
    selected = result;
    next();
  });
  
  const attack: Attack | null = selected;
  
  if (attack === null) {
    return state;
  }
  
  store.log(state, GameLog.LOG_PLAYER_COPIES_ATTACK, {
    name: player.name,
    attack: attack.name
  });
  
  // Perform attack
  const attackEffect = new AttackEffect(player, opponent, attack);
  store.reduceEffect(state, attackEffect);
  
  if (store.hasPrompts()) {
    yield store.waitPrompt(state, () => next());
  }
  
  if (attackEffect.damage > 0) {
    const dealDamage = new DealDamageEffect(attackEffect, attackEffect.damage);
    state = store.reduceEffect(state, dealDamage);
  }
  
  return state;
}

export class Mew extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 50;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [ ];

  public powers = [{
    name: 'Memories of Dawn',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'This Pokémon can use the attacks of any of your Basic Pokémon in play. (You still need the necessary Energy to use each attack.)'
  }];

  public attacks = [{
    name: 'Encounter',
    cost: [ CardType.COLORLESS ],
    damage: 0,
    text: 'Search your deck for a Pokémon, reveal it, and put it into your hand. Shuffle your deck afterward.'
  }];

  public set: string = 'FCO';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '29';

  public name: string = 'Mew';

  public fullName: string = 'Mew FCO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      if (!player.bench.some(c => c.cards.length > 0) || !player.bench.some(c => c.stage === Stage.BASIC)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        state = store.reduceEffect(state, powerEffect);
      } catch {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      
      const generator = useGenomeHacking(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      
      return store.prompt(state, new ChooseCardsPrompt(
        player.id,
        GameMessage.CHOOSE_CARD_TO_DECK,
        player.deck,
        { superType: SuperType.POKEMON },
        { min: 0, max: 1, allowCancel: false }
      ), selected => {
        selected.forEach((card, index) => {
          store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
        });
        
        store.prompt(state, new ShowCardsPrompt(
          opponent.id,
          GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
          selected
        ), () => { });
      
        return state;
      });
    }
  
    return state;
  }
  
}
  