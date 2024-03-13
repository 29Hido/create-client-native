import { Button, Modal, Pressable, Text, TextInput, View } from "react-native";
import { useAppSelector } from "@/lib/hooks";
import { useDispatch } from "react-redux";
import { setCreateModalVisible } from "@/lib/slices/bookSlice";

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
                <Button title="Close" color={'black'} onPress={() => dispatch(setCreateModalVisible(false))} />
            </View>
        </Modal>
    )
}