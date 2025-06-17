<script lang="ts">
interface Props {
  class?: string;
  children?: any;
}

let { class: className, children }: Props = $props();
</script>

<div class="card-header {className}">
  {@render children?.()}
</div>

<style>
  .card-header {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }
</style>