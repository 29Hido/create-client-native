import { useEffect, useState } from "react";
import { Log, LogType, addNotificationFunction, clearNotificationsFunction } from "../utils/Logs";

type useNotificationsType = {
    notifications: Log[];
    setNotifications: (notifications: Log[]) => void;
    addNotification: addNotificationFunction;
    clearNotifications: clearNotificationsFunction;
}

export const useNotifications = (): useNotificationsType => {
    const [notifications, setNotifications] = useState<Log[]>([]);

    useEffect(() => {
        // remove notifications after 5 seconds (refreshed when new one appear)
        const timeoutId = setTimeout(() => setNotifications([]), 5000);

        return () => clearTimeout(timeoutId);
    }, [notifications]);


    const addNotification = (type: keyof LogType, message: string) => {
        setNotifications([...notifications, new Log(type, message)]);
    };

    const clearNotifications = (type: keyof LogType) => {
        setNotifications([...notifications.filter(log => log.type !== type)]);
    };

    return { notifications, setNotifications, addNotification, clearNotifications };
}