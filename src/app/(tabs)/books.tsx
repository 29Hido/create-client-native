import Main from "@/components/Main";
import Navigation from "@/components/Navigation";
import CreateEditModal from "@/components/book/CreateEditModal";
import LogsRenderer from "@/components/book/LogsRenderer";
import Book from "@/lib/types/Book";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useContext, useEffect, useState } from "react";
import { useQuery } from '@tanstack/react-query'
import { Pressable, ScrollView, Text, View } from "react-native";
import { getAll } from "@/lib/api/bookApi";
import { HydraResponse } from "@/lib/types/HydraResponse";
import { Log, LogType } from "@/lib/utils/Logs";
import { extractHubURL, mercureSubscribe } from "@/lib/utils/mercure";
import { ENTRYPOINT } from "@/config/entrypoint";

export default function Books() {
  const { page = '1' } = useLocalSearchParams<{ page: string }>();
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

  const { isSuccess, data, isLoading } = useQuery<HydraResponse<Book>>({
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

  // @TODO : Wrap scrollview inside a context for the modal
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
            member.length < 1 && (
              isLoading && <Text className="text-1xl">Loading data...</Text> || <Text className="text-1xl text-red-500">No data found</Text>
            ) ||
            member.map((data: Book) => (
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
        <CreateEditModal addNotification={addNotification} isModalVisible={isModalVisible} isModalEdit={isModalEdit} data={currentData} setIsModalVisible={setIsModalVisible} />
      </ScrollView>
      <Navigation view={view} />
    </Main >
  );
}