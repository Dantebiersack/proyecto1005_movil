import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function HalfStarRating({ initial = 0, size = 35, onChange }) {
  const [rating, setRating] = useState(initial);

  const handleRating = (starIndex, isHalf) => {
    const newRating = isHalf ? starIndex + 0.5 : starIndex + 1;
    setRating(newRating);
    onChange && onChange(newRating);
  };

  const getStarType = (index) => {
    if (rating >= index + 1) return "full";
    if (rating >= index + 0.5) return "half";
    return "empty";
  };

  return (
    <View style={styles.container}>
      {[0, 1, 2, 3, 4].map((index) => {
        const type = getStarType(index);
        return (
          <View key={index} style={{ flexDirection: "row" }}>
            {/* Half (left) */}
            <TouchableOpacity
              style={{ width: size / 2, alignItems: "center" }}
              onPress={() => handleRating(index, true)}
            >
              <Text style={[styles.star, { fontSize: size }]}>
                {type === "full" || type === "half" ? "★" : "☆"}
              </Text>
            </TouchableOpacity>

            {/* Full (right) */}
            <TouchableOpacity
              style={{ width: size / 2, alignItems: "center" }}
              onPress={() => handleRating(index, false)}
            >
              <Text
                style={[
                  styles.star,
                  {
                    fontSize: size,
                    // muestra media estrella visualmente
                    color: type === "full" ? "#FFD700" : type === "half" ? "#FFD70080" : "#ccc",
                  },
                ]}
              >
                {type === "empty" ? "☆" : "★"}
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}

      <Text style={styles.number}>{rating}/5</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  star: {
    color: "#FFD700",
  },
  number: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
});
