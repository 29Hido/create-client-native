import CreateModal from "@/components/CreateModal";
import EditModal from "@/components/EditModal";
import Main from "@/components/Main";
import Navigation from "@/components/Navigation";
import { useLazyGetAllQuery } from "@/lib/api/bookApi";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setCreateModalVisible, setCurrentData, setData, setEditModalVisible, setPage, setView } from "@/lib/slices/bookSlice";
import Book from "@/lib/types/Book";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";

export default function Books() {
  const datas = useAppSelector(state => state.book.data);
  const view = useAppSelector(state => state.book.view);
  const { page = '1' } = useLocalSearchParams<{ page: string }>();

  const dispatch = useAppDispatch();
  const [getAll] = useLazyGetAllQuery();

  const toggleEditModal = (data: Book) => {
    dispatch(setCurrentData(data));
    dispatch(setEditModalVisible(true));
  };

  useEffect(() => {
    const intPage = parseInt(page);
    if (intPage < 0) return;
    dispatch(setPage(intPage));
    getAll(intPage)
      .unwrap()
      .then(fulfilled => {
        dispatch(setView(fulfilled["hydra:view"]));
        dispatch(setData(fulfilled["hydra:member"]));
      })
  }, [page]);

  return (
    <Main>
      <View className="py-3 flex flex-row items-center justify-between">
        <Text className="text-3xl">Books List</Text>
        <Pressable onPress={() => dispatch(setCreateModalVisible(true))}>
          <Text className="bg-cyan-500 cursor-pointer text-white text-sm font-bold py-2 px-4 rounded">Create</Text>
        </Pressable>
      </View>
      <ScrollView>
        <View>
          {
            datas.map(data => (
              <Pressable onPress={() => toggleEditModal(data)} key={data.id}>
                <View className="flex flex-column my-2 block max-w p-6 bg-white border border-gray-300 rounded shadow">
                  <Text>Title: {data.name}</Text>
                  <Text>Author: {data.author}</Text>
                  <Text>Rating: {data.rating}</Text>
                </View>
              </Pressable>
            ))
          }
        </View>
        <EditModal />
        <CreateModal />
      </ScrollView>
      <Navigation view={view} />
    </Main >
  );
}