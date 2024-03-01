import EditModal from "@/components/EditModal";
import Header from "@/components/Header";
import Main from "@/components/Main";
import ResourceContainer from "@/components/ResourceContainer";
import { useState } from "react";
import { View, Text, Pressable } from "react-native";

const datas = [
  {
    title: 'Un livre',
    author: 'Un auteur',
    rating: 5
  },
  {
    title: 'Hyperion',
    author: 'Dan Simmons',
    rating: 2
  },
  {
    title: 'The Airlords of Han',
    author: 'Philip Francis Nowlan',
    rating: 3
  }
]

export default function Books() {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editData, setEditData] = useState({})

  const toggleModal = () => {
    setEditModalVisible(!editModalVisible);
  }

  return (
    <Main>
      <ResourceContainer>
        <View className="flex flex-row items-center justify-between">
          <Text className="text-3xl">Books List</Text>
          <Text className="bg-cyan-500 cursor-pointer text-white text-sm font-bold py-2 px-4 rounded">Create</Text>
        </View>
        <View className="flex flex-column my-3">
          {
            datas.map(data => (
              <Pressable onPress={() => {
                toggleModal()
                setEditData(data)
              }} key={Math.random()}>
                <View className="flex flex-column my-2 block max-w p-6 bg-white border border-gray-300 rounded shadow">
                  <Text>Title: {data.title}</Text>
                  <Text>Author: {data.author}</Text>
                  <Text>Rating: {data.rating}</Text>
                </View>
              </Pressable>
            ))
          }
        </View>
        <EditModal data={editData} toggleModal={toggleModal} editModalVisible={editModalVisible}></EditModal>
      </ResourceContainer>
    </Main >
  );
}