export type LocationId = "home" | "school" | "park" | "cafe" | "work";

export type LocationRecord = {
  id: LocationId;
  name: string;
  flavor: string;
};

export const locationCatalog: Record<LocationId, LocationRecord> = {
  home: {
    id: "home",
    name: "Home",
    flavor: "편안하고 정돈된 공간"
  },
  school: {
    id: "school",
    name: "School",
    flavor: "관계와 이벤트가 모이는 중심지"
  },
  park: {
    id: "park",
    name: "Park",
    flavor: "시간을 보내기 좋은 산책 장소"
  },
  cafe: {
    id: "cafe",
    name: "Cafe",
    flavor: "대화와 만남에 잘 맞는 장소"
  },
  work: {
    id: "work",
    name: "Work",
    flavor: "업무와 퀘스트가 이어지는 공간"
  }
};
