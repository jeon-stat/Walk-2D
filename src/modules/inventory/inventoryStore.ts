import { create } from "zustand";

export type InventoryItem = {
  id: string;
  name: string;
  quantity: number;
  description: string;
};

type InventoryStore = {
  items: InventoryItem[];
  addItem: (item: InventoryItem) => void;
  removeItem: (itemId: string) => void;
};

const initialItems: InventoryItem[] = [
  { id: "ticket", name: "카페 쿠폰", quantity: 2, description: "대화 선택지에 활용하기 좋은 샘플 아이템" },
  { id: "notebook", name: "메모장", quantity: 1, description: "기억/관계 확장용 샘플 아이템" },
  { id: "badge", name: "학교 배지", quantity: 1, description: "장소 이벤트와 연결하기 좋은 아이템" }
];

export const useInventoryStore = create<InventoryStore>((set) => ({
  items: initialItems,
  addItem: (item) =>
    set((state) => ({
      items: [...state.items, item]
    })),
  removeItem: (itemId) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== itemId)
    }))
}));
