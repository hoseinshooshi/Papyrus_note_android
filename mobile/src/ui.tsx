import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  Text,
  TextInput,
  View,
  ViewStyle,
  TextStyle,
} from "react-native";

export const C = {
  bg: "#F8F6F0",
  paper: "#FAF7F0",
  paper2: "#F2ECE0",
  ink: "#2C2825",
  muted: "#7A6D5E",
  line: "#E2D8C3",
  brown: "#2E251C",
  gold: "#B08D57",
  green: "#5B8258",
  red: "#B5736E",
  blue: "#547F9C",
  cream: "#FCF9F0",
};

export function Card({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[{ backgroundColor: C.paper, borderColor: C.line, borderWidth: 1, borderRadius: 18, padding: 16 }, style]}>{children}</View>;
}

export function AppText({
  children,
  style,
  muted = false,
  serif = false,
  numberOfLines,
}: {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  muted?: boolean;
  serif?: boolean;
  numberOfLines?: number;
}) {
  return <Text style={[{ color: muted ? C.muted : C.ink, fontFamily: serif ? "Newsreader_400Regular" : "PlusJakartaSans_400Regular", fontSize: 14 }, style]} numberOfLines={numberOfLines}>{children}</Text>;
}

export function Heading({ children, subtitle }: { children: React.ReactNode; subtitle?: string }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <AppText serif style={{ fontSize: 27, fontFamily: "Newsreader_600SemiBold", lineHeight: 32 }}>{children}</AppText>
      {subtitle ? <AppText muted style={{ marginTop: 4, fontSize: 12 }}>{subtitle}</AppText> : null}
    </View>
  );
}

export function Button({
  title,
  onPress,
  variant = "dark",
  disabled = false,
  compact = false,
  icon,
  style,
}: {
  title: string;
  onPress: () => void;
  variant?: "dark" | "light" | "outline" | "danger" | "green";
  disabled?: boolean;
  compact?: boolean;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const palette = {
    dark: { bg: C.brown, border: C.brown, text: "#FFFFFF" },
    light: { bg: C.paper2, border: C.line, text: C.ink },
    outline: { bg: "transparent", border: C.line, text: C.ink },
    danger: { bg: "#F7E9E7", border: "#E8C9C4", text: "#8D3F3A" },
    green: { bg: "#EAF1E6", border: "#C7D9BE", text: "#355C31" },
  }[variant];
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, paddingVertical: compact ? 8 : 12, paddingHorizontal: compact ? 11 : 15, borderRadius: 12, borderWidth: 1, backgroundColor: palette.bg, borderColor: palette.border, opacity: disabled ? 0.45 : pressed ? 0.75 : 1 },
        style,
      ]}
    >
      {icon}
      <Text style={{ color: palette.text, fontFamily: "PlusJakartaSans_700Bold", fontSize: compact ? 11 : 12 }}>{title}</Text>
    </Pressable>
  );
}

export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  keyboardType,
  style,
  numberOfLines,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: "default" | "numeric" | "email-address";
  style?: StyleProp<ViewStyle>;
  numberOfLines?: number;
}) {
  return (
    <View style={[{ gap: 6 }, style]}>
      <AppText style={{ fontSize: 10, fontFamily: "PlusJakartaSans_700Bold", letterSpacing: 1, textTransform: "uppercase" }}>{label}</AppText>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#A99D8D"
        multiline={multiline}
        keyboardType={keyboardType}
        numberOfLines={numberOfLines}
        textAlignVertical={multiline ? "top" : "center"}
        style={{
          minHeight: multiline ? 116 : 44,
          paddingHorizontal: 13,
          paddingVertical: multiline ? 12 : 0,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: C.line,
          color: C.ink,
          backgroundColor: "#F5F0E6",
          fontSize: 13,
          fontFamily: "PlusJakartaSans_400Regular",
        }}
      />
    </View>
  );
}

export function Pill({
  label,
  selected = false,
  onPress,
  color,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  color?: string;
}) {
  const Wrapper: any = onPress ? Pressable : View;
  return (
    <Wrapper
      onPress={onPress}
      style={{
        paddingHorizontal: 11,
        paddingVertical: 7,
        borderRadius: 999,
        backgroundColor: selected ? C.brown : color || C.paper2,
        borderWidth: 1,
        borderColor: selected ? C.brown : C.line,
      }}
    >
      <Text style={{ color: selected ? "#FFFFFF" : C.muted, fontSize: 10, fontFamily: "PlusJakartaSans_700Bold" }}>{label}</Text>
    </Wrapper>
  );
}

export function Stat({ label, value, icon, tint = "#F0E9DB" }: { label: string; value: string | number; icon: React.ReactNode; tint?: string }) {
  return (
    <Card style={{ flex: 1, minWidth: 95, padding: 13 }}>
      <View style={{ width: 31, height: 31, borderRadius: 10, backgroundColor: tint, alignItems: "center", justifyContent: "center", marginBottom: 10 }}>{icon}</View>
      <AppText style={{ fontSize: 22, fontFamily: "Newsreader_600SemiBold" }}>{value}</AppText>
      <AppText muted style={{ fontSize: 9, marginTop: 2 }}>{label}</AppText>
    </Card>
  );
}

export function Loading({ label = "Opening your parchment vault…" }: { label?: string }) {
  return (
    <View style={{ flex: 1, backgroundColor: C.bg, justifyContent: "center", alignItems: "center", gap: 14 }}>
      <Text style={{ fontSize: 42 }}>📜</Text>
      <AppText serif style={{ fontSize: 24, fontFamily: "Newsreader_600SemiBold" }}>Papyrus</AppText>
      <ActivityIndicator color={C.gold} />
      <AppText muted style={{ fontSize: 11 }}>{label}</AppText>
    </View>
  );
}
