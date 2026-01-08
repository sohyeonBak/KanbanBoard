import React, { useState } from "react";
import { useColumns } from "../../services/hooks/useColumns";
import { useCards, useMoveCard } from "../../services/hooks/useCards";
import { Column, AddColumnForm } from "../columns";
import { Card, CardDetailPanel } from "../cards";
import { Card as CardType } from "../../services/types";

const Board: React.FC = () => {
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const [draggedCard, setDraggedCard] = useState<CardType | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const { data: columns, isLoading: columnsLoading, error: columnsError } = useColumns();
  const { data: cards, isLoading: cardsLoading } = useCards();
  const moveCard = useMoveCard();

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

  const handleDragStart = (card: CardType) => (e: React.DragEvent<HTMLDivElement>) => {
    setDraggedCard(card);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setDraggedCard(null);
    setDragOverColumn(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (columnId: string, index: number) => (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(columnId);
    setDragOverIndex(index);
  };

  const handleColumnDragOver = (columnId: string) => (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(columnId);
    const columnCards = getCardsByColumnId(columnId);
    setDragOverIndex(columnCards.length);
  };

  const handleDrop = (columnId: string, dropIndex: number) => async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedCard) return;

    const targetColumnCards = getCardsByColumnId(columnId);
    let newOrder = dropIndex;

    // If dropping in the same column
    if (draggedCard.column_id === columnId) {
      const currentIndex = targetColumnCards.findIndex(c => c.id === draggedCard.id);
      if (currentIndex === dropIndex) {
        setDraggedCard(null);
        setDragOverColumn(null);
        setDragOverIndex(null);
        return;
      }
      // Adjust index if moving down in the same column
      if (currentIndex < dropIndex) {
        newOrder = dropIndex - 1;
      }
    }

    try {
      await moveCard.mutateAsync({
        id: draggedCard.id,
        data: {
          target_column_id: columnId,
          new_order: newOrder,
        },
      });
    } catch (error) {
      console.error("Failed to move card:", error);
    }

    setDraggedCard(null);
    setDragOverColumn(null);
    setDragOverIndex(null);
  };

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
                <Column
                  key={column.id}
                  column={column}
                  onDragOver={handleColumnDragOver(column.id)}
                  onDrop={handleDrop(column.id, columnCards.length)}
                >
                  <>
                    {columnCards.length === 0 ? (
                      dragOverColumn === column.id && dragOverIndex === 0 && (
                        <div
                          className="drop-indicator"
                          onDragOver={handleDragOver(column.id, 0)}
                          onDrop={handleDrop(column.id, 0)}
                        />
                      )
                    ) : (
                      columnCards.map((card, index) => (
                        <React.Fragment key={card.id}>
                          {dragOverColumn === column.id && dragOverIndex === index && (
                            <div
                              className="drop-indicator"
                              onDragOver={handleDragOver(column.id, index)}
                              onDrop={handleDrop(column.id, index)}
                            />
                          )}
                          <div
                            onDragOver={handleDragOver(column.id, index)}
                            onDrop={handleDrop(column.id, index)}
                          >
                            <Card
                              card={card}
                              onClick={() => !draggedCard && setSelectedCard(card)}
                              onDragStart={handleDragStart(card)}
                              onDragEnd={handleDragEnd}
                              isDragging={draggedCard?.id === card.id}
                            />
                          </div>
                          {dragOverColumn === column.id && dragOverIndex === index + 1 && (
                            <div
                              className="drop-indicator"
                              onDragOver={handleDragOver(column.id, index + 1)}
                              onDrop={handleDrop(column.id, index + 1)}
                            />
                          )}
                        </React.Fragment>
                      ))
                    )}
                  </>
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

      {selectedCard && (
        <CardDetailPanel
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </div>
  );
};

export default Board;
