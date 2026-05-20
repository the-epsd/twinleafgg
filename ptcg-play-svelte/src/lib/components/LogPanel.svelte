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
