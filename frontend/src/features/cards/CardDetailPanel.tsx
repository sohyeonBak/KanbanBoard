import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { Card as CardType } from "../../services/types";
import { useCard, useUpdateCard, useDeleteCard } from "../../services/hooks/useCards";
import { ConfirmModal } from "../../commons";

interface CardDetailPanelProps {
  card: CardType;
  onClose: () => void;
}

const CardDetailPanel: React.FC<CardDetailPanelProps> = ({ card: initialCard, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: card } = useCard(initialCard.id);
  const currentCard = card || initialCard;

  const [formData, setFormData] = useState({
    title: currentCard.title,
    description: currentCard.description || "",
    due_date: currentCard.due_date ? dayjs(currentCard.due_date).format("YYYY-MM-DD") : "",
  });
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
  }>({});

  const updateCard = useUpdateCard();
  const deleteCard = useDeleteCard();

  useEffect(() => {
    if (currentCard) {
      setFormData({
        title: currentCard.title,
        description: currentCard.description || "",
        due_date: currentCard.due_date ? dayjs(currentCard.due_date).format("YYYY-MM-DD") : "",
      });
    }
  }, [currentCard]);

  const formatDateTime = (dateString: string) => {
    return dayjs(dateString).format("YYYY-MM-DD HH:mm:ss");
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No due date";
    const date = dayjs(dateString);
    const today = dayjs().startOf("day");
    const cardDate = date.startOf("day");

    if (cardDate.isBefore(today)) {
      return `${date.format("MMM D, YYYY")} (Overdue)`;
    } else if (cardDate.isSame(today)) {
      return `${date.format("MMM D, YYYY")} (Today)`;
    } else if (cardDate.isSame(today.add(1, "day"))) {
      return `${date.format("MMM D, YYYY")} (Tomorrow)`;
    }
    return date.format("MMM D, YYYY");
  };

  const validateForm = () => {
    const newErrors: { title?: string; description?: string } = {};

    const trimmedTitle = formData.title.trim();
    if (!trimmedTitle) {
      newErrors.title = "Title is required";
    } else if (trimmedTitle.length > 100) {
      newErrors.title = "Title must be 100 characters or less";
    }

    if (formData.description.length > 1000) {
      newErrors.description = "Description must be 1000 characters or less";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      title: currentCard.title,
      description: currentCard.description || "",
      due_date: currentCard.due_date ? dayjs(currentCard.due_date).format("YYYY-MM-DD") : "",
    });
    setErrors({});
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await updateCard.mutateAsync({
        id: currentCard.id,
        data: {
          title: formData.title.trim(),
          description: formData.description.trim() || undefined,
          due_date: formData.due_date || null,
          updated_at: dayjs().toISOString(),
        },
      });
      setIsEditing(false);
      setErrors({});
    } catch (error) {
      console.error("Failed to update card:", error);
    }
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteCard.mutateAsync(currentCard.id);
      setShowDeleteModal(false);
      onClose();
    } catch (error) {
      console.error("Failed to delete card:", error);
    }
  };

  return (
    <>
      <div className="card-detail-overlay" onClick={onClose} />
      <div className="card-detail-panel">
        <div className="card-detail-header">
          <h2 className="card-detail-title-text">Card Details</h2>
          <button className="card-detail-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" />
            </svg>
          </button>
        </div>

        <div className="card-detail-content">
          {isEditing ? (
            <>
              <div className="card-detail-field">
                <label className="card-detail-label">Title *</label>
                <input
                  type="text"
                  className={`card-detail-input ${
                    errors.title ? "input-error" : ""
                  }`}
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value });
                    if (errors.title) {
                      setErrors((prev) => ({ ...prev, title: undefined }));
                    }
                  }}
                  maxLength={101}
                />
                {errors.title && (
                  <div className="card-detail-error">{errors.title}</div>
                )}
                <div className="card-detail-char-count">
                  {formData.title.length}/100
                </div>
              </div>

              <div className="card-detail-field">
                <label className="card-detail-label">Description</label>
                <textarea
                  className={`card-detail-textarea ${
                    errors.description ? "input-error" : ""
                  }`}
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value });
                    if (errors.description) {
                      setErrors((prev) => ({ ...prev, description: undefined }));
                    }
                  }}
                  maxLength={1001}
                  rows={6}
                />
                {errors.description && (
                  <div className="card-detail-error">{errors.description}</div>
                )}
                <div className="card-detail-char-count">
                  {formData.description.length}/1000
                </div>
              </div>

              <div className="card-detail-field">
                <label className="card-detail-label">Due Date</label>
                <input
                  type="date"
                  className="card-detail-input"
                  value={formData.due_date}
                  onChange={(e) =>
                    setFormData({ ...formData, due_date: e.target.value })
                  }
                />
              </div>
            </>
          ) : (
            <>
              <div className="card-detail-section">
                <label className="card-detail-label">Title</label>
                <div className="card-detail-value">{currentCard.title}</div>
              </div>

              <div className="card-detail-section">
                <label className="card-detail-label">Description</label>
                <div className="card-detail-value">
                  {currentCard.description || "No description"}
                </div>
              </div>

              <div className="card-detail-section">
                <label className="card-detail-label">Due Date</label>
                <div className="card-detail-value">{formatDate(currentCard.due_date)}</div>
              </div>

              <div className="card-detail-section">
                <label className="card-detail-label">Created At</label>
                <div className="card-detail-value">
                  {formatDateTime(currentCard.created_at)}
                </div>
              </div>

              <div className="card-detail-section">
                <label className="card-detail-label">Updated At</label>
                <div className="card-detail-value">
                  {formatDateTime(currentCard.updated_at)}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="card-detail-actions">
          {isEditing ? (
            <>
              <button
                className="card-detail-button card-detail-button-primary"
                onClick={handleSave}
                disabled={updateCard.isPending}
              >
                {updateCard.isPending ? "Saving..." : "Save"}
              </button>
              <button
                className="card-detail-button card-detail-button-secondary"
                onClick={handleCancel}
                disabled={updateCard.isPending}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                className="card-detail-button card-detail-button-primary"
                onClick={handleEdit}
              >
                Edit
              </button>
              <button
                className="card-detail-button card-detail-button-danger"
                onClick={handleDelete}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Card"
        message="카드를 삭제 합니다."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteModal(false)}
        isLoading={deleteCard.isPending}
      />
    </>
  );
};

export default CardDetailPanel;
