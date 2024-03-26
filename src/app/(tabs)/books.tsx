import Main from "@/components/Main";
import Navigation from "@/components/Navigation";
import CreateEditModal from "@/components/book/CreateEditModal";
import LogsRenderer from "@/components/book/LogsRenderer";
import Book from "@/lib/types/Book";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { useQuery } from '@tanstack/react-query'
import { Pressable, ScrollView, Text, View } from "react-native";
import { getAll } from "@/lib/api/bookApi";
import { HydraResponse } from "@/lib/types/HydraResponse";
import { BookContext } from "@/components/book/Context";
import { useMercure } from "@/lib/hooks/mercure";
import { useData } from "@/lib/hooks/data";
import { useNotifications } from "@/lib/hooks/notifications";
import { useModal } from "@/lib/hooks/modal";

export default function Books() {
  const { page = '1' } = useLocalSearchParams<{ page: string }>();
  const { id = undefined } = useLocalSearchParams<{ id: Nullable<string> }>();

  const { member, setMember, processMercureData, view, setView, currentData, setCurrentData } = useData<Book>();
  const { notifications, addNotification, clearNotifications } = useNotifications();
  const { isModalEdit, isModalVisible, toggleEditModal, toggleCreateModal, setIsModalVisible } = useModal();

  useMercure(['/books'], processMercureData);

  const { isSuccess, data, isLoading, error } = useQuery<HydraResponse<Book>>({
    queryKey: ['getAll', page],
    queryFn: () => getAll(page),
  });

  useEffect(() => {
    if (isSuccess) {
      setMember(data["hydra:member"]);
      setView(data['hydra:view']);
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (!id) return;

    const data = member.find(item => item["@id"].includes(id) == true);
    if (data) {
      setCurrentData(data);
      toggleEditModal();
    }
  }, [member, id])

  return (
    <Main>
      <View className="py-3 flex flex-row items-center justify-between">
        <Text className="text-3xl">Books List</Text>
        <Pressable onPress={() => toggleCreateModal()}>
          <Text className="bg-cyan-500 cursor-pointer text-white text-sm font-bold py-2 px-4 rounded">Create</Text>
        </Pressable>
      </View>
      <BookContext.Provider value={{ notifications, addNotification, clearNotifications, isModalVisible, isModalEdit, setIsModalVisible, currentData }}>
        <ScrollView>
          <LogsRenderer />
          <View>
            {
              member && member.length < 1 &&
              <View className="flex flex-row justify-between p-4 mb-4 text-sm rounded-lg bg-cyan-300" role="alert">
                <Text className="text-1xl">{isLoading ? 'Loading data...' : 'No data found'}</Text>
              </View>
            }
            {
              error &&
              <View className="flex flex-row justify-between p-4 mb-4 text-sm rounded-lg bg-red-300" role="alert">
                <Text className="text-1xl">{error.message}</Text>
              </View>
            }
            {
              member && member.map((data: Book) => (
                !data.deleted && <Pressable onPress={() => {
                  setCurrentData(data);
                  toggleEditModal();
                }} key={data['@id']}>
                  <View className="flex flex-column my-2 block max-w p-6 bg-white border border-gray-300 rounded shadow">
                    <Text>ID: {data['@id']}</Text>
                    <Text>Title: {data.name}</Text>
                    <Text>Author: {data.author}</Text>
                    <Text>Rating: {data.rating}</Text>
                  </View>
                </Pressable>
              ))
            }
          </View>
          <CreateEditModal />
        </ScrollView>
      </BookContext.Provider>
      <Navigation view={view} />
    </Main >
  );
}