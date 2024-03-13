import { useLazyCreateQuery, useLazyGetAllQuery } from "@/lib/api/bookApi";
import { useAppSelector } from "@/lib/hooks";
import { setCreateModalVisible, setData, setView } from "@/lib/slices/bookSlice";
import Book from "@/lib/types/Book";
import { useState } from "react";
import { Controller, SubmitErrorHandler, useForm } from "react-hook-form";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

export default function Form() {
    const [createQuery] = useLazyCreateQuery();
    const [getAll] = useLazyGetAllQuery();
    const page = useAppSelector(state => state.book.page);
    const dispatch = useDispatch();

    const initValues: Book = {
        name: '',
        author: '',
        rating: 0,
    }

    const { control, handleSubmit, reset } = useForm<Book>({
        defaultValues: initValues
    });

    const [errors, setErrors] = useState([]);

    const onSubmit = (data: Book) => {
        intParser(data);
        createQuery(data)
            .unwrap()
            .then(() => {
                getAll(page)
                    .unwrap()
                    .then(fulfilled => {
                        dispatch(setView(fulfilled["hydra:view"]));
                        dispatch(setData(fulfilled["hydra:member"]));
                        dispatch(setCreateModalVisible(false));
                    })
            });
        return;
    };

    function intParser(data: Book) {
        Object.keys(data).forEach(key => {
            if ((typeof initValues[key] == "number") && !isNaN(parseInt(data[key]))) {
                data[key] = parseInt(data[key]);
            }
        });
        return;
    }

    const onError: SubmitErrorHandler<Book> = (errors, e) => {
        setErrors(Object.keys(errors));
        return;
    }


    return (
        <SafeAreaView>
            <View className="my-5 flex flex-column gap-3">
                {errors.length > 0 &&
                    <View className="p-4 mb-4 text-sm rounded-lg bg-red-400" role="alert">
                        <Text className="font-medium">
                            Field{errors.length > 1 ? "s" : ""} "{errors.join(', ')}" {errors.length > 1 ? "are" : "is"} empty
                        </Text>
                    </View>
                }
                <Controller
                    control={control}
                    render={({ field: { value, onChange } }) => (
                        <View className="flex flex-row items-center gap-3">
                            <Text>name :</Text>
                            <TextInput
                                value={value?.toString()}
                                onChangeText={onChange}
                                inputMode="text"
                                placeholder="name"
                                placeholderTextColor="black"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block p-1.5"
                            />
                        </View>
                    )}
                    name="name"
                    rules={{ required: 'name is required!' }}
                />

                <Controller
                    control={control}
                    render={({ field: { value, onChange } }) => (
                        <View className="flex flex-row items-center gap-3">
                            <Text>author :</Text>
                            <TextInput
                                value={value?.toString()}
                                onChangeText={onChange}
                                inputMode="text"
                                placeholder="author"
                                placeholderTextColor="black"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block p-1.5"
                            />
                        </View>
                    )}
                    name="author"
                    rules={{ required: 'author is required!' }}
                />

                <Controller
                    control={control}
                    render={({ field: { value, onChange } }) => (
                        <View className="flex flex-row items-center gap-3">
                            <Text>rating :</Text>
                            <TextInput
                                value={value?.toString()}
                                onChangeText={onChange}
                                inputMode="numeric"
                                placeholderTextColor="black"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block p-1.5"
                            />
                        </View>
                    )}
                    name="rating"
                    rules={{ required: 'rating is required!' }}
                />

                <Pressable onPress={handleSubmit(onSubmit, onError)}>
                    <Text className="bg-cyan-500 cursor-pointer text-white text-sm font-bold py-2 px-4 rounded">Create</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}