import request from '@/utils/request';
import type { ApiResponse } from '@/types';

/**
 * 上传文件
 * @param file 要上传的文件
 * @returns 文件的访问地址
 */
export const uploadFile = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  return request.post<any, ApiResponse<string>>('/file/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};