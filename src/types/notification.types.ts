export interface INotification {
  id: string;
  actionId: string;
  userId: string;
  type: string;
  title: string;
  content: string;
  path: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}
