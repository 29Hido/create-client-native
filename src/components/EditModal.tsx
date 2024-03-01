import { Button, Modal, Pressable, Text, TextInput, View } from "react-native";
import { useForm, Controller } from 'react-hook-form';
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";

export default function EditModal(props: { data: {}, toggleModal: Function, editModalVisible: boolean }) {
    const { toggleModal, editModalVisible } = props;
    const { title } = props.data;

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={editModalVisible}
        >
            <View className="flex p-5 absolute bottom-0 rounded bg-white border border-gray-300" style={{ height: '80%', width: '100%' }}>
                <View className="flex flex-row items-center justify-between">
                    <Text className="text-1xl">{title}</Text>
                    <View className="flex flex-row gap-3">
                        <Pressable onPress={() => {
                            alert(`${title} deleted`)
                            toggleModal()
                        }}>
                            <Text className="bg-red-500 cursor-pointer text-white text-sm font-bold py-2 px-4 rounded">Delete</Text>
                        </Pressable>
                        <Pressable onPress={() => toggleModal()}>
                            <Text className="bg-cyan-500 cursor-pointer text-white text-sm font-bold py-2 px-4 rounded">Close</Text>
                        </Pressable>
                    </View>
                </View>
                <Form existingData={props.data} />
            </View>
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