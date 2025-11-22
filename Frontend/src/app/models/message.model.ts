export interface MessageDTO {
  id?: number;
  senderId: number;
  receiverId: number;
  content: string;
  timestamp: string;
  read: boolean;
  edited: boolean;
  deleted: boolean;
  senderUsername?: string;
}
