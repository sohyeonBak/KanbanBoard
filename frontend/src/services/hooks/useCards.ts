import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cardsApi } from '../api/cards';
import { CreateCardDto, UpdateCardDto } from '../types';
import { validateCreateCard } from '../validation/cardValidation';

export const CARDS_QUERY_KEY = 'cards';

export const useCards = () => {
  return useQuery({
    queryKey: [CARDS_QUERY_KEY],
    queryFn: cardsApi.getAll,
  });
};

export const useCard = (id: string) => {
  return useQuery({
    queryKey: [CARDS_QUERY_KEY, id],
    queryFn: () => cardsApi.getById(id),
    enabled: !!id,
  });
};

export const useCardsByColumn = (columnId: string) => {
  return useQuery({
    queryKey: [CARDS_QUERY_KEY, 'column', columnId],
    queryFn: () => cardsApi.getByColumnId(columnId),
    enabled: !!columnId,
  });
};

export const useCreateCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCardDto) => {
      validateCreateCard(data);
      return cardsApi.create(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CARDS_QUERY_KEY] });
    },
  });
};

export const useUpdateCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCardDto }) =>
      cardsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CARDS_QUERY_KEY] });
    },
  });
};

export const useDeleteCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cardsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CARDS_QUERY_KEY] });
    },
  });
};
