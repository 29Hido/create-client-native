import { View, Text } from "react-native";

export default function Header(props: { title: string, subtitle?: string }) {
    const { title, subtitle } = props;
    return (
        <>
            <View className="pt-20">
                <View className="flex flex-col items-center gap-4 text-center">
                    <Text
                        role="heading"
                        className="text-3xl text-center native:text-5xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl"
                    >
                        {title}
                    </Text>
                </View>
                <View className="flex flex-col items-center gap-4 text-center">
                    <Text
                        role="heading"
                        className="my-4 text-lg text-gray-500"
                    >
                        {subtitle}
                    </Text>
                </View>
            </View>
        </>
    )
}