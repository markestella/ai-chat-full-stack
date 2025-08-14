import { GUEST_USER_ID } from '@/lib/constants';
import fetchAPI from './api';
import type { components } from '@/types/api-helpers';

type ChatSessionDto = components['schemas']['ChatSessionDto'];
type MessageDto = components['schemas']['MessageDto'];
type CreateSessionDto = components['schemas']['CreateSessionDto'];
type SendMessageDto = components['schemas']['SendMessageDto'];

export const getChatSessions = async (): Promise<ChatSessionDto[]> => {
  const data = await fetchAPI<ChatSessionDto[]>('/chat/sessions');
  return data || [];
};

export const createChatSession = async (data: CreateSessionDto): Promise<ChatSessionDto> => {
  const userId = data.userId ?? GUEST_USER_ID;
  const isGuest = userId === GUEST_USER_ID;
  const path = isGuest ? '/chat/guest/sessions' : '/chat/sessions';

  const response = await fetchAPI<ChatSessionDto>(path, {
    method: 'POST',
    body: JSON.stringify({ title: data.title, userId }),
    guest: isGuest,
  });

  if (!response) throw new Error('Failed to create session');
  return response;
};

export const deleteGuestSession = async (sessionId: string): Promise<void> => {
  const response = await fetchAPI<void>(`/api/Chat/guest/sessions/delete/${sessionId}`, {
    method: 'POST',
  });

  if (response === undefined) {
    throw new Error(`Failed to delete guest session ${sessionId}`);
  }
};

export const deleteChatSession = async (sessionId: string): Promise<void> => {
  const response = await fetchAPI<void>(`/chat/sessions/${sessionId}`, {
    method: 'DELETE',
  });

  if (response === undefined) {
    throw new Error(`Failed to delete session ${sessionId}`);
  }
};

export const deleteMultipleChatSessions = async (sessionIds: string[]): Promise<void> => {
  const response = await fetchAPI<void>('/chat/sessions', {
    method: 'DELETE',
    body: JSON.stringify(sessionIds),
  });

  if (response === undefined) {
    throw new Error(`Failed to delete multiple sessions`);
  }
};


export const sendMessage = async (data: SendMessageDto & { sessionId: string }): Promise<MessageDto> => {
  const userId = data.userId ?? GUEST_USER_ID;
  const isGuest = userId === GUEST_USER_ID;
  const path = isGuest
    ? `/chat/guest/sessions/${data.sessionId}/messages`
    : `/chat/sessions/${data.sessionId}/messages`;

  const response = await fetchAPI<MessageDto>(path, {
    method: 'POST',
    body: JSON.stringify({ content: data.content, userId }),
    guest: isGuest,
  });

  if (!response) throw new Error('Failed to send message');
  return response;
};

export const getChatMessages = async (sessionId: string): Promise<MessageDto[]> => {
  const data = await fetchAPI<MessageDto[]>(`/chat/sessions/${sessionId}/messages`);
  return data || [];
};

export const getGuestChatMessages = async (sessionId: string, userId?: string): Promise<MessageDto[]> => {
  const uid = userId ?? GUEST_USER_ID;
  const isGuest = uid === GUEST_USER_ID;
  const path = isGuest
    ? `/chat/guest/sessions/${sessionId}/messages`
    : `/chat/sessions/${sessionId}/messages`;

  const data = await fetchAPI<MessageDto[]>(path, {
    guest: isGuest,
  });
  
  return data || [];
};