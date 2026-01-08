import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { columnsApi } from '../api/columns';
import { CreateColumnDto, UpdateColumnDto } from '../types';
import { validateCreateColumn, validateUpdateColumn } from '../validation/columnValidation';

export const COLUMNS_QUERY_KEY = 'columns';

export const useColumns = () => {
  return useQuery({
    queryKey: [COLUMNS_QUERY_KEY],
    queryFn: columnsApi.getAll,
  });
};

export const useColumn = (id: string) => {
  return useQuery({
    queryKey: [COLUMNS_QUERY_KEY, id],
    queryFn: () => columnsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateColumn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateColumnDto) => {
      validateCreateColumn(data);
      return columnsApi.create(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COLUMNS_QUERY_KEY] });
    },
  });
};

export const useUpdateColumn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateColumnDto }) =>{
      validateUpdateColumn(id);
      return columnsApi.update(id, data)},
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COLUMNS_QUERY_KEY] });
    },
  });
};

export const useDeleteColumn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => columnsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COLUMNS_QUERY_KEY] });
    },
  });
};
