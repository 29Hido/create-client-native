import Main from "@/components/Main";
import Navigation from "@/components/Navigation";
import CreateEditModal from "@/components/book/CreateEditModal";
import LogsRenderer from "@/components/book/LogsRenderer";
import Book from "@/lib/types/Book";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from '@tanstack/react-query'
import { Pressable, ScrollView, Text, View } from "react-native";
import { getAll } from "@/lib/api/bookApi";
import { HydraResponse } from "@/lib/types/HydraResponse";
import { Log, LogType } from "@/lib/utils/Logs";

export default function Books() {
  const { page = '1' } = useLocalSearchParams<{ page: string }>();
  const [member, setMember] = useState([]);
  const [view, setView] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [currentData, setCurrentData] = useState(undefined);
  const [notifications, setNotifications] = useState([]);

  const { isSuccess, data } = useQuery<HydraResponse<Book>>({
    queryKey: ['getAll', page],
    queryFn: () => getAll(page),
  })

  useEffect(() => {
    if (isSuccess) {
      setMember(data["hydra:member"]);
      setView(data['hydra:view']);
    }
  }, [isSuccess, data]);

  useEffect(() => {
    const timeoutId = setTimeout(() => setNotifications([]), 5000);

    return () => clearTimeout(timeoutId);
  }, [notifications]);

  const toggleEditModal = (data: Book) => {
    setCurrentData(data);
    setIsModalVisible(true);
    setIsModalEdit(true);
  };

  const toggleCreateModal = () => {
    setIsModalVisible(true);
    setIsModalEdit(false);
  }

  const addNotification = (type: keyof LogType, message: string) => {
    setNotifications([...notifications, new Log(type, message)]);
  }

  const clearNotifications = (type: keyof LogType) => {
    console.log(type);
    setNotifications([...notifications.filter(log => log.type !== type)]);
  }

  return (
    <Main>
      <View className="py-3 flex flex-row items-center justify-between">
        <Text className="text-3xl">Books List</Text>
        <Pressable onPress={() => toggleCreateModal()}>
          <Text className="bg-cyan-500 cursor-pointer text-white text-sm font-bold py-2 px-4 rounded">Create</Text>
        </Pressable>
      </View>
      <ScrollView>
        <LogsRenderer notifications={notifications} clearNotifications={clearNotifications} />
        <View>
          {
            member.map((data: Book) => (
              <Pressable onPress={() => toggleEditModal(data)} key={data['@id']}>
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
        <CreateEditModal addNotification={addNotification} isModalVisible={isModalVisible} isModalEdit={isModalEdit} data={currentData} setIsModalVisible={setIsModalVisible} />
      </ScrollView>
      <Navigation view={view} />
    </Main >
  );
}