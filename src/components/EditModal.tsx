import { Button, Modal, Pressable, Text, TextInput, View } from "react-native";
import { useForm, Controller } from 'react-hook-form';
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";
import { useAppSelector } from "@/lib/hooks";
import { useDispatch } from "react-redux";
import { setData, setEditModalVisible, setView } from "@/lib/slices/bookSlice";
import { useLazyDeleteQuery, useLazyGetAllQuery } from "@/lib/api/bookApi";

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
                    <Text>{currentData.title}</Text>
                    <Button title="Close" color={'black'} onPress={() => dispatch(setEditModalVisible(false))} />
                    <Button title="Delete" color={'red'} onPress={() => handleDelete()} />
                </View>
            }
        </Modal>
    )
}

const Form = (props: { existingData }) => {
    const { title, author, rating } = props.existingData;
    const { control, handleSubmit, formState: { errors }, reset } = useForm();

    const onSubmit = (data) => {
        console.log('Submitted Data:', data);
    };

    useEffect(() => {
        reset({
            title: title,
            author: author,
            rating: rating
        });
    }, [props.existingData]);


    return (
        <SafeAreaView>
            <View className="my-5 flex flex-column gap-3">
                <Controller
                    control={control}
                    render={({ field: { value, onChange } }) => (
                        <TextInput
                            value={value?.toString()}
                            onChangeText={onChange}
                            inputMode="text"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                        />
                    )}
                    name="title"
                />

                <Controller
                    control={control}
                    render={({ field: { value, onChange } }) => (
                        <TextInput
                            value={value?.toString()}
                            onChangeText={onChange}
                            inputMode="text"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                        />
                    )}
                    name="author"
                />

                <Controller
                    control={control}
                    render={({ field: { value, onChange } }) => (
                        <TextInput
                            value={value?.toString()}
                            onChangeText={onChange}
                            inputMode="numeric"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                        />
                    )}
                    name="rating"
                />

                <Pressable onPress={handleSubmit(onSubmit)}>
                    <Text className="bg-green-500 cursor-pointer text-white text-sm font-bold py-2 px-4 rounded">Update</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}