import { axios } from '../axiosConfig';
import { Column, CreateColumnDto, UpdateColumnDto } from '../types';

export const columnsApi = {
  getAll: async (): Promise<Column[]> => {
    const response = await axios.get<Column[]>('/columns');
    return response.data;
  },

  getById: async (id: string): Promise<Column> => {
    const response = await axios.get<Column>(`/columns/${id}`);
    return response.data;
  },

  create: async (data: CreateColumnDto): Promise<Column> => {
    
    const response = await axios.post<Column>('/columns', data);
    return response.data;
  },

  update: async (id: string, data: UpdateColumnDto): Promise<Column> => {
    const response = await axios.patch<Column>(`/columns/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`/columns/${id}`);
  },
};
