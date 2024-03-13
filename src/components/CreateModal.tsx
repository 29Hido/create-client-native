import { useAppSelector } from "@/lib/hooks";
import { setCreateModalVisible } from "@/lib/slices/bookSlice";
import { Button, Modal, Pressable, Text, View } from "react-native";
import { useDispatch } from "react-redux";
import Form from "./Form";

export default function CreateModal() {
    const isVisible = useAppSelector(state => state.book.createModalVisible);
    const dispatch = useDispatch();

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
        >
            <View
                className="flex absolute bottom-0 rounded bg-white border border-gray-300"
                style={{ height: '80%', width: '100%', backgroundColor: '#e3e9e5' }}
            >
                <View className="px-12">
                    <Form />
                    <Pressable onPress={() => dispatch(setCreateModalVisible(false))}>
                        <Text className="bg-black cursor-pointer text-white text-sm font-bold py-2 px-4 rounded">Close</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    )
}