<script lang="ts">
interface Props {
  class?: string;
  children?: any;
}

let { class: className, children }: Props = $props();
</script>

<p class="card-description {className}">
  {@render children?.()}
</p>

<style>
  .card-description {
    margin: 0;
    font-size: 0.875rem;
    color: #6b7280;
    line-height: 1.4;
  }
</style>