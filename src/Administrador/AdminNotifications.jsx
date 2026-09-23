import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FaBell, FaCheck, FaCheckDouble } from "react-icons/fa";
import API_BASE from "../config/api";
import "./AdminNotifications.css";

const notificationsUrl = `${API_BASE}/admin/notificaciones`;

function getAuthConfig() {
  return {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
}

function normalizeNotification(notification) {
  const notificationData = notification.data ?? {};

  return {
    ...notification,
    id: notification.id ?? notification.notification_id,
    title: notification.title ?? notification.titulo ?? notificationData.title ?? notificationData.titulo ?? "Notificación",
    message: notification.message ?? notification.mensaje ?? notificationData.message ?? notificationData.mensaje ?? "",
    createdAt: notification.created_at ?? notification.createdAt,
    readAt: notification.read_at ?? notification.readAt ?? null,
  };
}

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const containerRef = useRef(null);

  const unreadCount = notifications.filter((notification) => !notification.readAt).length;

  const loadNotifications = async () => {
    try {
      const response = await axios.get(notificationsUrl, getAuthConfig());
      const payload = Array.isArray(response.data)
        ? response.data
        : response.data.data ?? response.data.notifications ?? [];

      setNotifications(payload.map(normalizeNotification));
    } catch (error) {
      console.error("No se pudieron cargar las notificaciones:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
    const intervalId = window.setInterval(loadNotifications, 30000);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const closeWhenClickingOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", closeWhenClickingOutside);
    return () => document.removeEventListener("mousedown", closeWhenClickingOutside);
  }, []);

  const markAsRead = async (notification) => {
    if (notification.readAt || actionId) return;

    setActionId(notification.id);
    try {
      await axios.patch(`${notificationsUrl}/${notification.id}/leer`, {}, getAuthConfig());
      setNotifications((current) => current.map((item) => (
        item.id === notification.id ? { ...item, readAt: new Date().toISOString() } : item
      )));
    } catch (error) {
      console.error("No se pudo marcar la notificación como leída:", error);
    } finally {
      setActionId(null);
    }
  };

  const markAllAsRead = async () => {
    if (!unreadCount || actionId) return;

    setActionId("all");
    try {
      await axios.patch(`${notificationsUrl}/leer-todas`, {}, getAuthConfig());
      const readAt = new Date().toISOString();
      setNotifications((current) => current.map((notification) => ({ ...notification, readAt })));
    } catch (error) {
      console.error("No se pudieron marcar las notificaciones como leídas:", error);
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="admin-notifications" ref={containerRef}>
      <button
        type="button"
        className="notification-btn admin-notifications-trigger"
        aria-label={`Notificaciones${unreadCount ? `, ${unreadCount} sin leer` : ""}`}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <FaBell />
        {unreadCount > 0 && <span className="admin-notifications-badge">{unreadCount > 99 ? "99+" : unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="admin-notifications-panel" role="dialog" aria-label="Notificaciones">
          <div className="admin-notifications-heading">
            <div>
              <h2>Notificaciones</h2>
              <span>{unreadCount ? `${unreadCount} sin leer` : "Todo al día"}</span>
            </div>
            <button
              type="button"
              className="admin-notifications-read-all"
              onClick={markAllAsRead}
              disabled={!unreadCount || actionId === "all"}
            >
              <FaCheckDouble /> Marcar todas
            </button>
          </div>

          <div className="admin-notifications-list">
            {isLoading && <p className="admin-notifications-empty">Cargando notificaciones...</p>}
            {!isLoading && !notifications.length && (
              <p className="admin-notifications-empty">No hay notificaciones.</p>
            )}
            {!isLoading && notifications.map((notification) => (
              <button
                type="button"
                className={`admin-notification-item${notification.readAt ? " is-read" : ""}`}
                key={notification.id}
                onClick={() => markAsRead(notification)}
                disabled={actionId === notification.id}
              >
                <span className="admin-notification-dot" aria-hidden="true" />
                <span className="admin-notification-content">
                  <strong>{notification.title}</strong>
                  <span>{notification.message}</span>
                  {notification.createdAt && (
                    <time dateTime={notification.createdAt}>
                      {new Date(notification.createdAt).toLocaleString("es-MX")}
                    </time>
                  )}
                </span>
                {!notification.readAt && <FaCheck className="admin-notification-check" aria-label="Marcar como leída" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
