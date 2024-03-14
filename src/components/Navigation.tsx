import { HydraView } from "@/lib/types/HydraView";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";

function NavigationIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string;
}) {
    return <FontAwesome size={32} style={{ marginBottom: -3 }} {...props} />;
}

export default function Navigation(props: { view: HydraView }) {
    const view = props.view;
    if (!view) {
        return null;
    }

    const router = useRouter();

    const {
        "hydra:first": first,
        "hydra:previous": previous,
        "hydra:next": next,
        "hydra:last": last,
    } = view;

    return (
        <View className="py-3 flex flex-row gap-5 items-center justify-center" style={{ position: 'absolute', bottom: 5, minWidth: '100%' }}>
            <Pressable onPress={() => {
                if (first) router.navigate(first)
            }}>
                <NavigationIcon name="fast-backward" color={previous ? '#3faab4' : 'grey'} />
            </Pressable>

            <Pressable onPress={() => {
                if (previous) router.navigate(previous)
            }}>
                <NavigationIcon name="backward" color={previous ? '#3faab4' : 'grey'} />
            </Pressable>

            <Pressable onPress={() => {
                if (next) router.navigate(next)
            }}>
                <NavigationIcon name="forward" color={next ? '#3faab4' : 'grey'} />
            </Pressable>

            <Pressable onPress={() => {
                if (last) router.navigate(last)
            }}>
                <NavigationIcon name="fast-forward" color={next ? '#3faab4' : 'grey'} />
            </Pressable>
        </View>
    );
}