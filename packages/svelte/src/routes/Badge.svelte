<script lang="ts">
interface Props {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
  class?: string;
  children?: any;
}

let { variant = 'default', class: className, children }: Props = $props();
</script>

<div class="badge badge-{variant} {className}">
  {@render children?.()}
</div>

<style>
  .badge {
    display: inline-flex;
    align-items: center;
    border-radius: 0.25rem;
    padding: 0.25rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 600;
    line-height: 1;
    border: 1px solid transparent;
  }

  .badge-default {
    background: #1f2937;
    color: white;
  }

  .badge-secondary {
    background: #f3f4f6;
    color: #1f2937;
  }

  .badge-outline {
    background: transparent;
    color: #1f2937;
    border-color: #e5e7eb;
  }

  .badge-destructive {
    background: #dc2626;
    color: white;
  }
</style>