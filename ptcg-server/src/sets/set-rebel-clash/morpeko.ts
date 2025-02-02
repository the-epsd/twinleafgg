import { Attack, ChooseAttackPrompt, ChoosePokemonPrompt, GameError, GameLog, GameMessage, PlayerType, PokemonCardList, SlotType, State, StateUtils, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';


export class Morpeko extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 80;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Torment',
      cost: [ CardType.COLORLESS ],
      damage: 20,
      text: 'Choose 1 of your opponent\'s Active Pokémon\'s attacks. During your opponent\'s next turn, that Pokémon can\'t use that attack.'
    },
    {
      name: 'Spark',
      cost: [CardType.LIGHTNING, CardType.COLORLESS],
      damage: 50,
      text: 'This attack also does 20 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    }
  ];

  public set: string = 'RCL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '73';

  public name: string = 'Morpeko';

  public fullName: string = 'Morpeko RCL';
  
  public readonly TORMENT_MARKER = 'TORMENT_MARKER';
  public DISABLED_ATTACK: Attack | undefined;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
            
      const hasBenched = opponent.bench.some(b => b.cards.length > 0);
      if (!hasBenched) {
        return state;
      }
            
      state = store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [ SlotType.BENCH ],
        { allowCancel: false }
      ), targets => {
        if (!targets || targets.length === 0) {
          return;
        }
        const damageEffect = new PutDamageEffect(effect, 20);
        damageEffect.target = targets[0];
        store.reduceEffect(state, damageEffect);
      });
            
      return state;
    }
    
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
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

    if (effect instanceof EndTurnEffect) {
      const owner = StateUtils.findOwner(state, StateUtils.findCardList(state, this));
      const player = (effect as EndTurnEffect).player;
      
      if (player !== owner) {
        return state;
      }
      
      player.marker.removeMarker(this.TORMENT_MARKER, this);
    }

    return state;
  }

}
