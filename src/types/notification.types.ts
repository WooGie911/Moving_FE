export interface INotification {
  id: string;
  actionId: string;
  userId: string;
  type: string;
  message: string;
  content: string;
  path: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}
