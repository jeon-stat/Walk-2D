import { create } from "zustand";

export type RelationshipNpc = {
  id: string;
  name: string;
  affinity: number;
  title: string;
};

type RelationshipStore = {
  npcs: RelationshipNpc[];
  adjustAffinity: (npcId: string, delta: number) => void;
};

const initialNpcs: RelationshipNpc[] = [
  { id: "mina", name: "Mina", affinity: 35, title: "친구" },
  { id: "jun", name: "Jun", affinity: 22, title: "동료" }
];

function getTitle(affinity: number) {
  if (affinity >= 80) return "절친";
  if (affinity >= 60) return "가까운 사이";
  if (affinity >= 40) return "친구";
  if (affinity >= 20) return "알아가는 중";
  return "낯선 사이";
}

export const useRelationshipStore = create<RelationshipStore>((set) => ({
  npcs: initialNpcs,
  adjustAffinity: (npcId, delta) =>
    set((state) => ({
      npcs: state.npcs.map((npc) =>
        npc.id === npcId
          ? {
              ...npc,
              affinity: Math.max(0, Math.min(100, npc.affinity + delta)),
              title: getTitle(Math.max(0, Math.min(100, npc.affinity + delta)))
            }
          : npc
      )
    }))
}));
