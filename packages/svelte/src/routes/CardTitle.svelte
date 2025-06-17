<script lang="ts">
interface Props {
  class?: string;
  children?: any;
}

let { class: className, children }: Props = $props();
</script>

<h3 class="card-title {className}">
  {@render children?.()}
</h3>

<style>
  .card-title {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 1.2;
    color: #1f2937;
  }
</style>