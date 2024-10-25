import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const index = () => {
  return (
    <SafeAreaView>
      <View className="flex items-center justify-center">
        <Text className="text-4xl font-bold text-center text-red-500">
          Index
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default index;
