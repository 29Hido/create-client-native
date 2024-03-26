import { Modal, Pressable, Text, View } from "react-native";
import Form from "./Form";
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Book from "@/lib/types/Book";
import { remove } from "@/lib/api/bookApi";
import { useContext, useEffect, useState } from "react";
import ConfirmModal from "../ConfirmModal";
import { BookContext } from "./Context";

export default function CreateEditModal() {
    const [requestDelete, setRequestDelete] = useState(false);
    const queryClient = useQueryClient();

    const context = useContext(BookContext);
    const { addNotification, setIsModalVisible, isModalEdit, isModalVisible, currentData: data } = context;

    const deleteMutation = useMutation({
        mutationFn: (data: Book) => remove(data),
        onError: (error: string) => {
            addNotification('error', error.toString());
        },
        onSuccess: (data) => {
            if (data.ok) {
                addNotification('success', 'The book has been deleted');
            } else {
                addNotification('error', `An error occured while deleting the book (${data.statusText})`);
            }
            queryClient.invalidateQueries({ queryKey: ['getAll'] });
        },
    });

    useEffect(() => {
        if (data && data.deleted) {
            addNotification('error', `${data["@id"]} has been deleted by another user`);
            setIsModalVisible(false);
            setRequestDelete(false);
        }
    }, [JSON.stringify(data)])

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
                    <ConfirmModal isVisible={requestDelete} onAccept={onAccept} onDecline={onDecline} />
                    <Text className="text-2xl">{isModalEdit ? `Edit Book` : 'Create a new Book'}</Text>
                    <Form />
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