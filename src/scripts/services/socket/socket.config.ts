import Cookies from 'js-cookie';

import { ErrorPacketTypeEnum } from '@/core/enums/packets-type.enum';

import { io, Socket } from 'socket.io-client';
import { refreshTokens } from '../axios/requests/auth/auth.service';

let isRefreshing = false;
let socket: Socket | null = null;
let eventCallbacks: { [event: string]: Function[] } = {};

export const initializeSocket = (): void => {
  const accessToken = Cookies.get('accessToken');

  socket = io(import.meta.env.VITE_PUBLIC_WEBSOCKET_URL, {
    transports: ['websocket'],
    auth: {
      token: accessToken,
    },
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });
};

export const emit = async (
  event: string,
  args: any,
  callback?: (data: any) => any,
): Promise<void> => {
  if (!socket) throw new Error('Socket not initialized');

  if (callback) {
    on(ErrorPacketTypeEnum.BAD_REQUEST_ERROR, (error) => {
      callback(error);
      off(ErrorPacketTypeEnum.BAD_REQUEST_ERROR);
    });

    on(ErrorPacketTypeEnum.NOT_FOUND_ERROR, (error) => {
      callback(error);
      off(ErrorPacketTypeEnum.BAD_REQUEST_ERROR);
    });
  }

  on(ErrorPacketTypeEnum.UNAUTHORIZED_ERROR, async () => {
    off(ErrorPacketTypeEnum.UNAUTHORIZED_ERROR);
    await handleTokenRefresh();
  });

  socket.emit(event, args, (response: any) => {
    if (callback) {
      callback(response);
      off(ErrorPacketTypeEnum.NOT_FOUND_ERROR);
      off(ErrorPacketTypeEnum.BAD_REQUEST_ERROR);
    }
  });
};

export const on = (event: string, callback: (data: any) => any): void => {
  if (!socket) throw new Error('Socket not initialized');

  if (!eventCallbacks[event]) {
    eventCallbacks[event] = [];
    socket.on(event, (data) => {
      eventCallbacks[event].forEach((cb) => cb(data));
    });
  }
  eventCallbacks[event].push(callback);
};

export const off = (event: string, callback?: (data: any) => void): void => {
  if (!socket) throw new Error('Socket not initialized');

  if (eventCallbacks[event]) {
    if (callback) {
      eventCallbacks[event] = eventCallbacks[event].filter((cb) => cb !== callback);
    } else {
      delete eventCallbacks[event];
    }

    socket.off(event, callback);
  }
};

export const handleTokenRefresh = async (): Promise<void> => {
  if (!socket) throw new Error('Socket not initialized');

  if (!isRefreshing) {
    isRefreshing = true;
    try {
      const refreshToken = Cookies.get('refreshToken');

      if (!refreshToken) throw new Error('Unauthenticated user');

      await refreshTokens(refreshToken);
      const accessToken = Cookies.get('accessToken');

      socket.disconnect();
      socket.auth = { token: accessToken };
      socket.connect();
    } catch (error) {
      socket.disconnect();
    } finally {
      isRefreshing = false;
    }
  }
};
