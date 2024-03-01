import { View } from "react-native";

export default function ResourceContainer({ children }) {
    return (
        <View className="py-20">
            {children}
        </View>
    )
}