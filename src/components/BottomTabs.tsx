type BottomTabItem = {
  id: string;
  label: string;
  icon: string;
};

type BottomTabsProps = {
  items: BottomTabItem[];
  activeId: string;
  onChange: (id: string) => void;
};

export function BottomTabs({ items, activeId, onChange }: BottomTabsProps) {
  return (
    <nav className="bottom-tabs" aria-label="Primary">
      {items.map((item) => {
        const active = item.id === activeId;
        return (
          <button
            key={item.id}
            type="button"
            className={active ? "bottom-tab active" : "bottom-tab"}
            onClick={() => onChange(item.id)}
          >
            <span className="bottom-tab-icon">{item.icon}</span>
            <span className="bottom-tab-label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
