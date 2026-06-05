import { Image, StyleSheet, Text, View } from "react-native";

import basicCharacterPng from "../assets/character/basic-character.png";
import { theme } from "../constants/theme.js";

export function CharacterStage({ character }) {
  return (
    <View style={styles.shell}>
      <View style={styles.stage}>
        <Image
          source={basicCharacterPng}
          alt={character?.label ?? "Character"}
          resizeMode="contain"
          style={styles.image}
        />
      </View>

      <View style={styles.captionWrap}>
        <Text style={styles.name}>{character?.label ?? "Character"}</Text>
        <Text style={styles.copy}>2D basic PNG character</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    height: 340,
    position: "relative",
    overflow: "hidden",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: "#000000",
  },
  stage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  image: {
    width: "100%",
    height: "100%",
    maxWidth: 250,
    maxHeight: 300,
  },
  captionWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  name: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "900",
  },
  copy: {
    marginTop: 4,
    color: "rgba(255,255,255,0.72)",
    fontSize: 13,
    fontWeight: "700",
  },
});
