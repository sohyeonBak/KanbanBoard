import React, { useState } from "react";
import { useCreateColumn } from "../../services/hooks/useColumns";
import { useToast } from "../../app/providers/ToastProvider";
import { getErrorMessage } from "../../commons/utils/errorUtils";

interface AddColumnFormProps {
  onClose: () => void;
  nextOrder: number;
}

const AddColumnForm: React.FC<AddColumnFormProps> = ({
  onClose,
  nextOrder,
}) => {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const createColumn = useCreateColumn();
  const { showSuccess, showError } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    // if (!trimmedTitle) {
    //   setError("Column title is required");
    //   return;
    // }

    try {
      await createColumn.mutateAsync({
        title: trimmedTitle,
        order: nextOrder,
      });
      showSuccess("Column created successfully");
      setTitle("");
      setError("");
      onClose();
    } catch (err) {
      setError("Failed to create column");
      showError(getErrorMessage(err));
    }
  };

  const handleCancel = () => {
    setTitle("");
    setError("");
    onClose();
  };

  return (
    <div className="add-column-form">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="add-column-input"
          placeholder="Enter column title..."
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError("");
          }}
          autoFocus
        />
        {error && <div className="add-column-error">{error}</div>}
        <div className="add-column-actions">
          <button
            type="submit"
            className="add-column-submit"
            disabled={createColumn.isPending}
          >
            {createColumn.isPending ? "Adding..." : "Add Column"}
          </button>
          <button
            type="button"
            className="add-column-cancel"
            onClick={handleCancel}
            disabled={createColumn.isPending}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddColumnForm;
