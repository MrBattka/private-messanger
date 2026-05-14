import { io, Socket } from "socket.io-client";
import type { Message } from "@messenger/shared";

let socket: Socket | null = null;

export const initSocket = (url: string, token: string): Socket => {
  socket = io(url, {
    auth: { token },
    reconnection: true,
  });

  socket.on("connect", () => {
    console.log("Connected to server:", socket?.id);
  });

  return socket;
};

export const sendMessage = (msg: Omit<Message, "id" | "createdAt">) => {
  socket?.emit("message:send", msg);
};

export const onNewMessage = (callback: (msg: Message) => void) => {
  socket?.on("message:new", callback);
};