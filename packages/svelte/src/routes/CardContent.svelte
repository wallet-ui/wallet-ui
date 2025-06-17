<script lang="ts">
interface Props {
  class?: string;
  children?: any;
}

let { class: className, children }: Props = $props();
</script>

<div class="card-content {className}">
  {@render children?.()}
</div>

<style>
  .card-content {
    padding: 1.5rem;
    padding-top: 0;
  }
</style>