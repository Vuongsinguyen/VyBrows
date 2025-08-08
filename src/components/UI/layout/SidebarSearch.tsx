import type { JSX } from 'preact';

interface SidebarSearchProps {
  search: string;
  onSearch: (value: string) => void;
}

export default function SidebarSearch({ search, onSearch }: SidebarSearchProps) {
  const handleInput = (e: JSX.TargetedEvent<HTMLInputElement, Event>) => {
    onSearch(e.currentTarget.value);
  };
  return (
    <form class="space-y-4 mb-6" autoComplete="off" onSubmit={e => e.preventDefault()}>
      <label class="block text-sm font-bold mb-2" htmlFor="sidebar-search">Search</label>
      <input
        id="sidebar-search"
        type="text"
        placeholder="Search projects..."
        class="w-full border border-border rounded p-2 mb-4 bg-surface-1 text-on-surface"
        value={search}
        onInput={handleInput}
        autoFocus
      />
    </form>
  );
}
