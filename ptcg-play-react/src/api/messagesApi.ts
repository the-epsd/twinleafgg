import { apiGet, apiPost } from './client';
import type { ConversationsResponse, MessagesResponse, OkResponse } from '../types/responses';

export function getConversations(): Promise<ConversationsResponse> {
  return apiGet<ConversationsResponse>('/v1/messages/list');
}

export function getMessages(userId: number): Promise<MessagesResponse> {
  return apiGet<MessagesResponse>(`/v1/messages/get/${userId}`);
}

export function deleteMessages(userId: number): Promise<OkResponse> {
  return apiPost<OkResponse>('/v1/messages/deleteMessages', { id: userId });
}
