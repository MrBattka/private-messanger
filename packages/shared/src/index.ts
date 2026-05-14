export type User = {
  id: string;
  name: string;
  email: string;
};

export type Message = {
  id: string;
  text: string;
  senderId: string;
  receiverId: string;
  chatId: string;
  createdAt: string;
};

// Пример: Zod-схема (можно использовать и в бэкенде, и в клиенте)
import { z } from "zod";

export const messageSchema = z.object({
  text: z.string().min(1).max(1000),
  chatId: z.string().uuid(),
});