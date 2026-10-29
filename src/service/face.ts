import {
  FACE_REGISTER_API,
  FACE_VERIFY_API,
  FACE_CACHE_STATS_API,
  FACE_REFRESH_CACHE_API
} from '../utils/constant';
import { post, get } from '../utils/axios';

export const registerFace = async (body: { staffId: number; descriptor: number[] }) => {
  return await post(FACE_REGISTER_API, body);
};

export const verifyFace = async (body: {
  descriptor: number[];
  staffId?: number; // when given the face must match this staff (1:1), otherwise 1:N
  userID?: number;
  latitude: string;
  longitude: string;
  date?: string; // DD-MM-YYYY
  time?: string; // HH:mm:ss
}) => {
  return await post(FACE_VERIFY_API, body);
};

export const getFaceCacheStats = async () => {
  return await get(FACE_CACHE_STATS_API);
};

export const refreshFaceCache = async () => {
  return await post(FACE_REFRESH_CACHE_API, {});
};
