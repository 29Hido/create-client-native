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
    const router = useRouter();

    return (
        <View className="py-3 flex flex-row gap-5 items-center justify-center" style={{ position: 'absolute', bottom: 5, minWidth: '100%' }}>

            <Pressable onPress={() => {
                if (view['hydra:last']) router.navigate(view["hydra:first"])
            }}>
                <NavigationIcon name="fast-backward" color={view["hydra:previous"] ? '#3faab4' : 'grey'} />
            </Pressable>

            <Pressable onPress={() => {
                if (view['hydra:previous']) router.navigate(view["hydra:previous"])
            }}>
                <NavigationIcon name="backward" color={view["hydra:previous"] ? '#3faab4' : 'grey'} />
            </Pressable>

            <Pressable onPress={() => {
                if (view['hydra:next']) router.navigate(view["hydra:next"])
            }}>
                <NavigationIcon name="forward" color={view["hydra:next"] ? '#3faab4' : 'grey'} />
            </Pressable>

            <Pressable onPress={() => {
                if (view['hydra:last']) router.navigate(view["hydra:last"])
            }}>
                <NavigationIcon name="fast-forward" color={view["hydra:next"] ? '#3faab4' : 'grey'} />
            </Pressable>
        </View>
    );
}