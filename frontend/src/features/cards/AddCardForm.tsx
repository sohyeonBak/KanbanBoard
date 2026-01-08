import React, { useState } from "react";
import dayjs from "dayjs";
import { useCreateCard } from "../../services/hooks/useCards";

interface AddCardFormProps {
  columnId: string;
  onClose: () => void;
  nextOrder: number;
}

const AddCardForm: React.FC<AddCardFormProps> = ({
  columnId,
  onClose,
  nextOrder,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
  }>({});
  const createCard = useCreateCard();

  const validateForm = () => {
    const newErrors: { title?: string; description?: string } = {};

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      newErrors.title = "Title is required";
    } else if (trimmedTitle.length > 100) {
      newErrors.title = "Title must be 100 characters or less";
    }

    if (description.length > 1000) {
      newErrors.description = "Description must be 1000 characters or less";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const now = dayjs().toISOString();
      await createCard.mutateAsync({
        column_id: columnId,
        title: title.trim(),
        description: description.trim() || undefined,
        due_date: dueDate ? dayjs(dueDate).format("YYYY-MM-DD") : null,
        order: nextOrder,
        created_at: now,
        updated_at: now,
      });
      setTitle("");
      setDescription("");
      setDueDate("");
      setErrors({});
      onClose();
    } catch (err) {
      console.error("Failed to create card:", err);
    }
  };

  const handleCancel = () => {
    setTitle("");
    setDescription("");
    setDueDate("");
    setErrors({});
    onClose();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (errors.title) {
      setErrors((prev) => ({ ...prev, title: undefined }));
    }
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(e.target.value);
    if (errors.description) {
      setErrors((prev) => ({ ...prev, description: undefined }));
    }
  };

  return (
    <div className="add-card-form">
      <form onSubmit={handleSubmit}>
        <div className="add-card-field">
          <input
            type="text"
            className={`add-card-input add-card-title-input ${
              errors.title ? "input-error" : ""
            }`}
            placeholder="Enter card title... *"
            value={title}
            onChange={handleTitleChange}
            maxLength={101}
            autoFocus
          />
          {errors.title && (
            <div className="add-card-error">{errors.title}</div>
          )}
          <div className="add-card-char-count">
            {title.length}/100
          </div>
        </div>

        <div className="add-card-field">
          <textarea
            className={`add-card-input add-card-description-input ${
              errors.description ? "input-error" : ""
            }`}
            placeholder="Enter description (optional)..."
            value={description}
            onChange={handleDescriptionChange}
            maxLength={1001}
            rows={3}
          />
          {errors.description && (
            <div className="add-card-error">{errors.description}</div>
          )}
          <div className="add-card-char-count">
            {description.length}/1000
          </div>
        </div>

        <div className="add-card-field">
          <label className="add-card-label">Due Date (optional)</label>
          <input
            type="date"
            className="add-card-input add-card-date-input"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div className="add-card-actions">
          <button
            type="submit"
            className="add-card-submit"
            disabled={createCard.isPending}
          >
            {createCard.isPending ? "Adding..." : "Add Card"}
          </button>
          <button
            type="button"
            className="add-card-cancel"
            onClick={handleCancel}
            disabled={createCard.isPending}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCardForm;
