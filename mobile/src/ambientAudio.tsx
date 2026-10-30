import React, { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { setAudioModeAsync, useAudioPlayer } from "expo-audio";
import { AppText, Button, Card, Pill } from "./ui";

export type AmbientSoundType = "rain" | "forest" | "lofi" | "waves" | "drone";

const PRESETS: {
  id: AmbientSoundType;
  name: string;
  nameFa: string;
  tagline: string;
  icon: keyof typeof Ionicons.glyphMap;
  tint: string;
}[] = [
  { id: "rain", name: "Rain", nameFa: "باران ملایم", tagline: "Window raindrops & calm rumble", icon: "rainy-outline", tint: "#3B82F6" },
  { id: "forest", name: "Forest Breeze", nameFa: "نسیم جنگل و پرندگان", tagline: "Canopy wind & gentle birds", icon: "leaf-outline", tint: "#10B981" },
  { id: "lofi", name: "Lo-Fi Coffeehouse", nameFa: "کافه لوفای و وینیل", tagline: "Warm chords & vinyl crackle", icon: "cafe-outline", tint: "#D97706" },
  { id: "waves", name: "Ocean Tide", nameFa: "موج‌های ساحل آرام", tagline: "Slow, meditative shore swells", icon: "water-outline", tint: "#06B6D4" },
  { id: "drone", name: "Celestial Focus", nameFa: "ارتعاش عمیق ۴۳۲ هرتز", tagline: "432 Hz meditative harmonic drone", icon: "planet-outline", tint: "#8B5CF6" },
];

export function AmbientAudioPlayer({ isFocusTimerRunning = false }: { isFocusTimerRunning?: boolean }) {
  const rain = useAudioPlayer(require("../assets/sounds/rain.wav"));
  const forest = useAudioPlayer(require("../assets/sounds/forest.wav"));
  const lofi = useAudioPlayer(require("../assets/sounds/lofi.wav"));
  const waves = useAudioPlayer(require("../assets/sounds/waves.wav"));
  const drone = useAudioPlayer(require("../assets/sounds/drone.wav"));
  const players = useMemo(() => ({ rain, forest, lofi, waves, drone }), [rain, forest, lofi, waves, drone]);

  const [currentType, setCurrentType] = useState<AmbientSoundType>("rain");
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [previousVolume, setPreviousVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [autoPlayOnFocus, setAutoPlayOnFocus] = useState(true);
  const [expanded, setExpanded] = useState(true);
  const wasFocusRunning = useRef(false);

  useEffect(() => {
    Object.values(players).forEach((player) => {
      player.loop = true;
      player.volume = 0.5;
    });
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      interruptionMode: "doNotMix",
    }).catch(() => undefined);
    return () => {
      Object.values(players).forEach((player) => {
        player.pause();
        player.setActiveForLockScreen(false);
      });
    };
  }, []);

  const stopAll = (except?: AmbientSoundType) => {
    (Object.keys(players) as AmbientSoundType[]).forEach((key) => {
      if (key === except) return;
      players[key].pause();
      players[key].setActiveForLockScreen(false);
    });
  };

  const playSound = (type: AmbientSoundType) => {
    stopAll(type);
    const preset = PRESETS.find((item) => item.id === type) || PRESETS[0];
    const player = players[type];
    player.loop = true;
    player.volume = isMuted ? 0 : volume;
    player.setActiveForLockScreen(true, {
      title: preset.name,
      artist: "Papyrus Focus Soundscape",
      albumTitle: "Papyrus Notes",
    });
    player.play();
    setCurrentType(type);
    setIsPlaying(true);
  };

  const pauseSound = () => {
    stopAll();
    setIsPlaying(false);
  };

  useEffect(() => {
    if (autoPlayOnFocus && isFocusTimerRunning && !isPlaying) {
      playSound(currentType);
    }
    if (autoPlayOnFocus && wasFocusRunning.current && !isFocusTimerRunning && isPlaying) {
      pauseSound();
    }
    wasFocusRunning.current = isFocusTimerRunning;
  }, [isFocusTimerRunning, autoPlayOnFocus]);

  const chooseSound = (type: AmbientSoundType) => {
    if (isPlaying) playSound(type);
    else setCurrentType(type);
  };

  const setVolumeLevel = (value: number) => {
    setVolume(value);
    setIsMuted(value === 0);
    players[currentType].volume = value;
  };

  const toggleMute = () => {
    if (isMuted) {
      const restore = previousVolume > 0 ? previousVolume : 0.5;
      setVolume(restore);
      setIsMuted(false);
      players[currentType].volume = restore;
    } else {
      setPreviousVolume(volume);
      setVolume(0);
      setIsMuted(true);
      players[currentType].volume = 0;
    }
  };

  const activePreset = PRESETS.find((item) => item.id === currentType) || PRESETS[0];

  return (
    <Card style={{ gap: 12 }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Pressable onPress={() => setExpanded(!expanded)} style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1 }}>
          <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: "#2E251C", alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="musical-notes-outline" size={18} color="#E6C994" />
          </View>
          <View style={{ flex: 1 }}>
            <AppText style={{ fontSize: 11, fontFamily: "PlusJakartaSans_700Bold" }}>Focus Soundscape</AppText>
            <AppText muted style={{ fontSize: 9, marginTop: 2 }}>{isPlaying ? "Playing" : "Ambient nature & lo-fi sounds"}</AppText>
          </View>
          <Ionicons name={expanded ? "chevron-up" : "chevron-down"} color="#7A6D5E" size={16} />
        </Pressable>
        <Button
          title={isPlaying ? "Pause" : "Play"}
          compact
          onPress={() => isPlaying ? pauseSound() : playSound(currentType)}
          icon={<Ionicons name={isPlaying ? "pause" : "play"} size={13} color="#FFFFFF" />}
          style={{ marginLeft: 8 }}
        />
      </View>

      {expanded ? (
        <>
          <View style={{ gap: 7 }}>
            <AppText muted style={{ fontSize: 9, letterSpacing: 1, fontFamily: "PlusJakartaSans_700Bold" }}>CHOOSE YOUR ATMOSPHERE</AppText>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 7 }}>
              {PRESETS.map((preset) => {
                const selected = preset.id === currentType;
                return (
                  <Pressable
                    key={preset.id}
                    onPress={() => chooseSound(preset.id)}
                    style={{
                      width: "48%",
                      minHeight: 65,
                      borderRadius: 12,
                      padding: 10,
                      backgroundColor: selected ? "#EEE5D4" : "#F7F3EA",
                      borderWidth: selected ? 2 : 1,
                      borderColor: selected ? preset.tint : "#E2D8C3",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Ionicons name={preset.icon} size={19} color={preset.tint} />
                    <View style={{ flex: 1 }}>
                      <AppText style={{ fontSize: 10, fontFamily: "PlusJakartaSans_700Bold" }}>{preset.name}</AppText>
                      <AppText muted style={{ fontSize: 8, marginTop: 2 }}>{preset.nameFa}</AppText>
                    </View>
                    {selected ? <Ionicons name="checkmark-circle" size={15} color={preset.tint} /> : null}
                  </Pressable>
                );
              })}
            </View>
            <AppText muted style={{ fontSize: 9, lineHeight: 14 }}>{activePreset.tagline}</AppText>
          </View>

          <View style={{ borderTopWidth: 1, borderTopColor: "#E2D8C3", paddingTop: 11, gap: 9 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <AppText style={{ fontSize: 10, fontFamily: "PlusJakartaSans_700Bold" }}>VOLUME</AppText>
              <Pressable onPress={toggleMute} style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                <Ionicons name={isMuted ? "volume-mute-outline" : "volume-medium-outline"} size={16} color="#7A6D5E" />
                <AppText muted style={{ fontSize: 9 }}>{isMuted ? "Muted" : `${Math.round(volume * 100)}%`}</AppText>
              </Pressable>
            </View>
            <View style={{ flexDirection: "row", gap: 7 }}>
              {[0.15, 0.3, 0.5, 0.7, 1].map((level) => (
                <Pressable
                  key={level}
                  onPress={() => setVolumeLevel(level)}
                  style={{ flex: 1, height: 8, borderRadius: 8, backgroundColor: !isMuted && volume >= level ? "#B08D57" : "#E7DECF" }}
                  accessibilityRole="button"
                  accessibilityLabel={`Set volume to ${Math.round(level * 100)} percent`}
                />
              ))}
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <AppText muted style={{ fontSize: 9 }}>Auto-play when focus begins</AppText>
              <Pill label={autoPlayOnFocus ? "On" : "Off"} selected={autoPlayOnFocus} onPress={() => setAutoPlayOnFocus(!autoPlayOnFocus)} />
            </View>
          </View>
        </>
      ) : null}
    </Card>
  );
}
