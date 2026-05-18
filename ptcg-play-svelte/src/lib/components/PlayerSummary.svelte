<script lang="ts">
  import type { PlayerView } from '../game/types';

  export let player: PlayerView;
  export let active = false;
</script>

<div class:active class="player-summary">
  <strong>{player.name}</strong>
  <span>{active ? 'Active turn' : 'Waiting'}</span>
  <span>Hand {player.hand.length}</span>
  <span>Prizes {player.prizesLeft}</span>
</div>
