import { Modal, Pressable, Text, View } from "react-native";
import Form from "./Form";
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Book from "@/lib/types/Book";
import { notifyMercure, remove } from "@/lib/api/bookApi";
import { addNotificationFunction } from "@/lib/utils/Logs";
import { useCallback, useContext, useState } from "react";
import ConfirmModal from "../ConfirmModal";
import { mercureContext } from "@/lib/utils/mercureContext";

export default function CreateEditModal(props: { addNotification: addNotificationFunction, isModalVisible: boolean, isModalEdit: boolean, data?: Book, setIsModalVisible: Function }) {
    const { addNotification, isModalVisible, isModalEdit, data, setIsModalVisible } = props;
    const [requestDelete, setRequestDelete] = useState(false);
    const queryClient = useQueryClient();
    const { hubURL } = useContext(mercureContext);

    const mercureMut = useMutation({
        mutationFn: (data: Book) => notifyMercure(hubURL, data),
        onError: (error: string) => {
            console.log(error);
        },
        onSuccess: (data) => {
            console.log(data);
        },
    })

    const deleteMutation = useMutation({
        mutationFn: (data: Book) => remove(data),
        onError: (error: string) => {
            addNotification('error', error.toString());
        },
        onSuccess: () => {
            addNotification('success', 'The book has been deleted');
            if (hubURL) {
                mercureMut.mutate({
                    "@id": data["@id"]
                });
            } else {
                queryClient.invalidateQueries({ queryKey: ['getAll'] });
            }
        },
    });

    const onAccept = () => {
        deleteMutation.mutate(data);
        setIsModalVisible(false);
        setRequestDelete(false);
    }

    const onDecline = () => {
        setRequestDelete(false);
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
        >
            <View
                className="flex absolute bottom-0 rounded bg-white border border-gray-300"
                style={styles.container}
            >
                <View className="relative py-12 px-12">
                    {data && data.deleted && <View className="flex flex-row justify-between p-4 mb-4 text-sm rounded-lg bg-red-300" role="alert">
                        <View>
                            <Text>This resource has been deleted by another user</Text>
                        </View>
                    </View>}
                    <ConfirmModal isVisible={requestDelete} onAccept={onAccept} onDecline={onDecline} />
                    <Text className="text-2xl">{isModalEdit ? `Edit Book` : 'Create a new Book'}</Text>
                    {<Form mercureMut={mercureMut} data={data} addNotification={addNotification} isModalEdit={isModalEdit} setIsModalVisible={setIsModalVisible} />}
                    {
                        isModalEdit &&
                        <Pressable onPress={() => setRequestDelete(true)}>
                            <Text className="bg-red-500 cursor-pointer text-white text-sm font-bold py-2 px-4 rounded">Delete</Text>
                        </Pressable>
                    }
                    <Pressable style={styles.closeButton} onPress={() => setIsModalVisible(false)}>
                        <Text className="bg-black cursor-pointer text-white text-sm font-bold py-2 px-4 rounded">Close</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    )
}

const styles = {
    container: { height: '80%', width: '100%', backgroundColor: '#e3e9e5' },
    closeButton: { position: 'absolute', right: 5, top: 5 }
}