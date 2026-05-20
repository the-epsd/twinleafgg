<script lang="ts">
  import { labelFor } from '../game/labels';

  type Props = {
    logs?: Array<{ message: string }>;
  };

  let { logs = [] }: Props = $props();
  let visibleLogs = $derived(logs.slice(-18).reverse());
</script>

<aside class="log-panel">
  <h2>Log</h2>
  {#each visibleLogs as log}
    <p>{labelFor(log.message)}</p>
  {/each}
</aside>

<style>
  .log-panel {
    position: absolute;
    z-index: 8;
    right: 14px;
    top: auto;
    bottom: 14px;
    width: 128px;
    transform: none;
    align-self: center;
    max-height: min(28vh, 220px);
    overflow: auto;
    padding: 9px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 6px;
    background: rgba(12, 15, 19, 0.76);
    color: rgba(245, 248, 255, 0.9);
    box-shadow: 0 10px 24px rgba(12, 15, 19, 0.18);
    backdrop-filter: blur(10px);
    font-size: 10px;
    line-height: 1.25;
  }

  .log-panel h2 {
    margin: 0 0 7px;
    font-size: 11px;
    color: rgba(245, 248, 255, 0.94);
  }

  .log-panel p {
    margin: 0 0 7px;
  }

  @media (max-width: 980px) {
    .log-panel {
      position: static;
      transform: none;
      width: auto;
      max-height: 180px;
    }
  }
</style>
