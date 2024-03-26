import Main from "@/components/Main";
import Navigation from "@/components/Navigation";
import CreateEditModal from "@/components/book/CreateEditModal";
import LogsRenderer from "@/components/book/LogsRenderer";
import Book from "@/lib/types/Book";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useQuery } from '@tanstack/react-query'
import { Pressable, ScrollView, Text, View } from "react-native";
import { getAll } from "@/lib/api/bookApi";
import { HydraResponse } from "@/lib/types/HydraResponse";
import { Log, LogType } from "@/lib/utils/Logs";
import { extractHubURL, mercureSubscribe } from "@/lib/utils/mercure";
import { ENTRYPOINT } from "@/config/entrypoint";
import { BookContext } from "@/components/book/Context";

export default function Books() {
  const { page = '1' } = useLocalSearchParams<{ page: string }>();
  const { id = undefined } = useLocalSearchParams<{ id: Nullable<string> }>();
  const [member, setMember] = useState<Book[]>([]);
  const [view, setView] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [currentData, setCurrentData] = useState<Nullable<Book>>(undefined);
  const [notifications, setNotifications] = useState<Log[]>([]);
  const [eventSource, setEventSource] = useState<Nullable<EventSource>>(undefined);

  const [hubURL, setHubURL] = useState<Nullable<string>>(undefined);

  const setData = useCallback((data: Book) => {
    const currentMember = member.find(item => item["@id"] == data["@id"]);
    if (Object.keys(data).length == 1) {
      data.deleted = true;
    }

    if (currentMember) {
      Object.assign(currentMember, data);
      setMember([...member]); // force re-render
    } else {
      setMember([...member, data]);
    }
  }, [member]);

  useEffect(() => {
    fetch(`${ENTRYPOINT}/books`)
      .then(res => {
        const extractedUrl = extractHubURL(res);
        if (extractedUrl) {
          setHubURL(extractedUrl.href);
        }
      });

    if (hubURL) {
      setEventSource(mercureSubscribe<Book>(new URL(hubURL), ['/books'], setData));
    }

    return () => eventSource && eventSource.close();
  }, [hubURL, setData]);

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
      toggleEditModal(data);
    }
  }, [member, id])

  useEffect(() => {
    // remove notifications after 5 seconds (refreshed when new one appear)
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
                !data.deleted && <Pressable onPress={() => toggleEditModal(data)} key={data['@id']}>
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