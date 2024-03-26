import Book from "@/lib/types/Book";
import { Log, addNotificationFunction, clearNotificationsFunction } from "@/lib/utils/Logs";
import { createContext } from "react";

type BookContextData = {
    notifications: Log[];
    addNotification: addNotificationFunction,
    clearNotifications: clearNotificationsFunction,
    isModalVisible: boolean;
    isModalEdit: boolean;
    setIsModalVisible: (visible: boolean) => void;
    currentData?: Book;

}

export const BookContext = createContext<BookContextData>(null);