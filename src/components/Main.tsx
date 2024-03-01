import { View } from "react-native";

export default function Main({ children }) {
    return (
        <View className="flex flex-1 px-6 md:px-8">
            {children}
        </View>
    )
}