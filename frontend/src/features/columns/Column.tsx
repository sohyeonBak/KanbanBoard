import React, { useState, useRef, useEffect } from "react";
import { Column as ColumnType } from "../../services/types";
import {
  useUpdateColumn,
  useDeleteColumn,
} from "../../services/hooks/useColumns";
import { ConfirmModal } from "../../commons";
import { AddCardForm } from "../cards";

interface ColumnProps {
  column: ColumnType;
  children?: React.ReactNode;
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
}

const Column: React.FC<ColumnProps> = ({ column, children, onDragOver, onDrop }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(column.title);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const updateColumn = useUpdateColumn();
  const deleteColumn = useDeleteColumn();

  const childrenArray = React.Children.toArray(children);
  const cardCount = childrenArray.length;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleTitleClick = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setTitle(column.title);
      setIsEditing(false);
      return;
    }

    if (trimmedTitle !== column.title) {
      try {
        await updateColumn.mutateAsync({
          id: column.id,
          data: { title: trimmedTitle },
        });
      } catch (error) {
        setTitle(column.title);
      }
    }

    setIsEditing(false);
  };

  const handleBlur = () => {
    handleSave();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setTitle(column.title);
      setIsEditing(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteColumn.mutateAsync(column.id);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Failed to delete column:", error);
    }
  };

  return (
    <>
      <div className="kanban-column">
        <div className="kanban-column-header">
          <div className="kanban-column-header-left">
            {isEditing ? (
              <input
                ref={inputRef}
                type="text"
                className="kanban-column-title-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
              />
            ) : (
              <h2 className="kanban-column-title" onClick={handleTitleClick}>
                {column.title}
              </h2>
            )}
          </div>
          <div className="kanban-column-header-right">
            <span className="kanban-column-count">{cardCount}</span>
            <button
              className="kanban-column-delete-button"
              onClick={handleDeleteClick}
              title="Delete column"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M11 3h3v1h-1v9a2 2 0 01-2 2H5a2 2 0 01-2-2V4H2V3h3V2a1 1 0 011-1h4a1 1 0 011 1v1zM6 2v1h4V2H6zm6 2H4v9a1 1 0 001 1h6a1 1 0 001-1V4zM6 6h1v6H6V6zm3 0h1v6H9V6z" />
              </svg>
            </button>
          </div>
        </div>
        <div
          className="kanban-column-content"
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          {children}
          {isAddingCard ? (
            <AddCardForm
              columnId={column.id}
              onClose={() => setIsAddingCard(false)}
              nextOrder={cardCount}
            />
          ) : (
            <button
              className="add-card-button"
              onClick={() => setIsAddingCard(true)}
            >
              <span>+</span>
              <span>Add Card</span>
            </button>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Column"
        message="삭제하시겠습니까? 삭제 시 해당 컬럼의 모든 카드도 함께 삭제 됩니다."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteModal(false)}
        isLoading={deleteColumn.isPending}
      />
    </>
  );
};

export default Column;
