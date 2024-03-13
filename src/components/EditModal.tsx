import { useLazyDeleteQuery, useLazyGetAllQuery } from "@/lib/api/bookApi";
import { useAppSelector } from "@/lib/hooks";
import { setData, setEditModalVisible, setView } from "@/lib/slices/bookSlice";
import { Button, Modal, Text, View } from "react-native";
import { useDispatch } from "react-redux";

export default function EditModal() {
    const isVisible = useAppSelector(state => state.book.editModalVisible);
    const currentData = useAppSelector(state => state.book.currentData);
    const page = useAppSelector(state => state.book.page);

    const [deleteQuery] = useLazyDeleteQuery();
    const [getAll] = useLazyGetAllQuery();
    const dispatch = useDispatch();

    function handleDelete() {
        deleteQuery(currentData.id)
            .unwrap()
            .then(() => {
                getAll(page)
                    .unwrap()
                    .then(fulfilled => {
                        dispatch(setEditModalVisible(false));
                        dispatch(setView(fulfilled["hydra:view"]));
                        dispatch(setData(fulfilled["hydra:member"]))
                    });
            });
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
        >
            {currentData &&
                <View
                    className="flex absolute bottom-0 rounded bg-white border border-gray-300"
                    style={{ height: '80%', width: '100%', backgroundColor: '#e3e9e5' }}
                >
                    <Text>{currentData.name}</Text>
                    <Button title="Close" color={'black'} onPress={() => dispatch(setEditModalVisible(false))} />
                    <Button title="Delete" color={'red'} onPress={() => handleDelete()} />
                </View>
            }
        </Modal>
    )
}