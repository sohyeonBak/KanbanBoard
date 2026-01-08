import React, { useState } from "react";
import { useColumns } from "../../services/hooks/useColumns";
import { useCards } from "../../services/hooks/useCards";
import { Column, AddColumnForm } from "../columns";
import { Card } from "../cards";

const Board: React.FC = () => {
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const { data: columns, isLoading: columnsLoading, error: columnsError } = useColumns();
  const { data: cards, isLoading: cardsLoading } = useCards();

  if (columnsLoading || cardsLoading) {
    return (
      <div className="board-container">
        <div className="board-loading">Loading board...</div>
      </div>
    );
  }

  if (columnsError) {
    return (
      <div className="board-container">
        <div className="board-error">
          Error loading columns: {columnsError.message}
        </div>
      </div>
    );
  }

  const sortedColumns = columns
    ? [...columns].sort((a, b) => a.order - b.order)
    : [];

  const getCardsByColumnId = (columnId: string) => {
    if (!cards) return [];
    return cards
      .filter((card) => card.column_id === columnId)
      .sort((a, b) => a.order - b.order);
  };

  const nextOrder = sortedColumns.length > 0
    ? Math.max(...sortedColumns.map((col) => col.order)) + 1
    : 0;

  return (
    <div className="board-container">
      <div className="board-header">
        <div className="board-header-content">
          <h1 className="board-title">Kanban Board</h1>
          <button
            className="add-column-button"
            onClick={() => setIsAddingColumn(true)}
          >
            + Add Column
          </button>
        </div>
      </div>
      <div className="board-content">
        {sortedColumns.length === 0 && !isAddingColumn ? (
          <div className="board-empty">
            No columns yet. Create your first column to get started!
          </div>
        ) : (
          <>
            {sortedColumns.map((column) => {
              const columnCards = getCardsByColumnId(column.id);
              return (
                <Column key={column.id} column={column}>
                  {columnCards.map((card) => (
                    <Card key={card.id} card={card} />
                  ))}
                </Column>
              );
            })}
            {isAddingColumn && (
              <AddColumnForm
                onClose={() => setIsAddingColumn(false)}
                nextOrder={nextOrder}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Board;
