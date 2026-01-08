import { axios } from '../axiosConfig';
import { Card, CreateCardDto, UpdateCardDto } from '../types';

export const cardsApi = {
  getAll: async (): Promise<Card[]> => {
    const response = await axios.get<Card[]>('/cards');
    return response.data;
  },

  getById: async (id: string): Promise<Card> => {
    const response = await axios.get<Card>(`/cards/${id}`);
    return response.data;
  },

  getByColumnId: async (columnId: string): Promise<Card[]> => {
    const response = await axios.get<Card[]>(`/cards?column_id=${columnId}`);
    return response.data;
  },

  create: async (data: CreateCardDto): Promise<Card> => {
    const response = await axios.post<Card>('/cards', data);
    return response.data;
  },

  update: async (id: string, data: UpdateCardDto): Promise<Card> => {
    const response = await axios.patch<Card>(`/cards/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`/cards/${id}`);
  },

  move: async (id: string, data: { target_column_id: string; new_order: number }): Promise<Card> => {
    const response = await axios.patch<Card>(`/cards/${id}/move`, data);
    return response.data;
  },
};
