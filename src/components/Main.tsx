import { View } from "react-native";

export default function Main({ children }) {
    return (
        <View className="flex flex-1 py-16" style={{ position: 'relative', marginHorizontal: '3%' }}>
            {children}
        </View>
    )
}