import { createPlaceholderSvg } from "../../../assets/character/placeholders/placeholderSvg";
import { CharacterEmotion, CharacterPart } from "../types";
import { emotionFaceMap, partOptions } from "./characterCatalog";

const partStageMap: Record<CharacterPart, "body" | "hair" | "eyes" | "mouth" | "top" | "bottom" | "shoes" | "accessory"> = {
  body: "body",
  hair: "hair",
  eyes: "eyes",
  mouth: "mouth",
  top: "top",
  bottom: "bottom",
  shoes: "shoes",
  accessory: "accessory"
};

export function getCharacterPartAsset(
  part: CharacterPart,
  variantId: string,
  emotion: CharacterEmotion
) {
  const option = partOptions[part].find((entry) => entry.id === variantId) ?? partOptions[part][0];
  const stage = partStageMap[part];
  const mappedEmotion = emotionFaceMap[emotion];
  const label = `${part}:${option.label}`;

  if (part === "eyes") {
    return createPlaceholderSvg({
      label,
      fill: option.tint,
      accent: "#ecf2ff",
      stage,
      emotion
    });
  }

  if (part === "mouth") {
    return createPlaceholderSvg({
      label,
      fill: option.tint,
      accent: "#ffd8e3",
      stage,
      emotion
    });
  }

  if (part === "accessory" && variantId === "none") {
    return createPlaceholderSvg({
      label,
      fill: "rgba(0,0,0,0)",
      accent: "#d8deff",
      stage,
      emotion
    });
  }

  return createPlaceholderSvg({
    label,
    fill: option.tint,
    accent: mappedEmotion.eyes,
    stage,
    emotion
  });
}
