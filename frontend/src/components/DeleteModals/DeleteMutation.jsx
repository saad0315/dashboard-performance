import { useState } from 'react';
import { coloredToast } from '../Alerts/SimpleAlert';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useDeleteMutation = ({ mutationFn, successMessage, queryKey }) => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const deleteMutation = useMutation({
    mutationKey: queryKey,
    mutationFn: () => mutationFn(selectedId),
    onSuccess: (response) => {
      queryClient.invalidateQueries(queryKey);
      setModalOpen(false);
      coloredToast("success", successMessage, "top", null, null, 1000);
    },
    onError: (error) => {
      console.log(error);
      coloredToast("danger", error?.response?.data?.message, "top");
    },
  });

  return {
    deleteMutation,
    modalOpen,
    setModalOpen,
    setSelectedId,
  };
};

export default useDeleteMutation;
