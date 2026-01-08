import React from "react";
import { Card as CardType } from "../../services/types";

interface CardProps {
  card: CardType;
  onClick?: () => void;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd?: (e: React.DragEvent<HTMLDivElement>) => void;
  isDragging?: boolean;
}

const Card: React.FC<CardProps> = ({ card, onClick, onDragStart, onDragEnd, isDragging }) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    const isOverdue = date < today;
    const isDueToday = date.getTime() === today.getTime();
    const isDueTomorrow = date.getTime() === tomorrow.getTime();

    const formattedDate = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    return { formattedDate, isOverdue, isDueToday, isDueTomorrow };
  };

  const dueDateInfo = formatDate(card.due_date);

  return (
    <div
      className={`kanban-card ${dueDateInfo?.isOverdue ? "overdue" : ""} ${isDragging ? "dragging" : ""}`}
      onClick={onClick}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <h3 className="kanban-card-title">{card.title}</h3>
      {card.description && (
        <p className="kanban-card-description">{card.description}</p>
      )}
      {dueDateInfo && (
        <div
          className={`kanban-card-due-date ${
            dueDateInfo.isOverdue
              ? "overdue"
              : dueDateInfo.isDueToday
              ? "due-today"
              : dueDateInfo.isDueTomorrow
              ? "due-soon"
              : ""
          }`}
        >
          <svg
            className="kanban-card-due-date-icon"
            width="12"
            height="12"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path d="M11 0H5v1H1v2h14V1h-4V0zM2 4v11h12V4H2zm9 9H5V8h6v5z" />
          </svg>
          <span className="kanban-card-due-date-text">
            {dueDateInfo.formattedDate}
          </span>
        </div>
      )}
    </div>
  );
};

export default Card;
