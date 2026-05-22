<script lang="ts">
  type IconName =
    | 'coin'
    | 'energy'
    | 'prize'
    | 'cards'
    | 'attack'
    | 'damage'
    | 'shuffle'
    | 'hourglass'
    | 'check';

  type Props = {
    name: IconName;
    size?: number;
  };

  let { name, size = 16 }: Props = $props();
</script>

<svg
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
>
  {#if name === 'coin'}
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v10M9 10h6M9 14h6" />
  {:else if name === 'energy'}
    <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" fill="currentColor" stroke="none" />
  {:else if name === 'prize'}
    <path d="m12 3 2.6 5.3 5.9.8-4.3 4.2 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.1l5.9-.8L12 3z" fill="currentColor" stroke="none" />
  {:else if name === 'cards'}
    <rect x="3" y="6" width="12" height="15" rx="2" />
    <path d="M7 3h12a2 2 0 0 1 2 2v12" />
  {:else if name === 'attack'}
    <path d="m4 4 7 7 9-3-3 9-7-7-3 7-3-13z" fill="currentColor" stroke="none" />
  {:else if name === 'damage'}
    <path d="M12 2c2 4 6 6 6 11a6 6 0 1 1-12 0c0-5 4-7 6-11z" fill="currentColor" stroke="none" />
  {:else if name === 'shuffle'}
    <path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
  {:else if name === 'hourglass'}
    <path d="M5 3h14M5 21h14M7 3v4a5 5 0 0 0 10 0V3M7 21v-4a5 5 0 0 1 10 0v4" />
  {:else if name === 'check'}
    <path d="M5 12l5 5L20 7" />
  {/if}
</svg>

<style>
  svg {
    display: block;
  }
</style>
