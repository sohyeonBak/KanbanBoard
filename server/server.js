const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Custom route for moving cards
server.patch('/api/cards/:id/move', (req, res) => {
  const db = router.db; // Get database
  const { id } = req.params;
  const { target_column_id, new_order } = req.body;

  // Get the card to move
  const card = db.get('cards').find({ id }).value();

  if (!card) {
    return res.status(404).json({ error: 'Card not found' });
  }

  const sourceColumnId = card.column_id;

  // Get all cards in the target column (excluding the card being moved if it's in the same column)
  let targetColumnCards = db.get('cards')
    .filter(c => c.column_id === target_column_id && c.id !== id)
    .value();

  // Sort by order
  targetColumnCards.sort((a, b) => a.order - b.order);

  // Insert the card at the new position and reorder
  targetColumnCards.splice(new_order, 0, card);

  // Update orders for all cards in target column
  targetColumnCards.forEach((c, index) => {
    db.get('cards')
      .find({ id: c.id })
      .assign({
        order: index,
        column_id: target_column_id
      })
      .write();
  });

  // If moved from a different column, reorder source column
  if (sourceColumnId !== target_column_id) {
    const sourceColumnCards = db.get('cards')
      .filter({ column_id: sourceColumnId })
      .value()
      .sort((a, b) => a.order - b.order);

    sourceColumnCards.forEach((c, index) => {
      db.get('cards')
        .find({ id: c.id })
        .assign({ order: index })
        .write();
    });
  }

  // Get updated card
  const updatedCard = db.get('cards').find({ id }).value();

  res.json(updatedCard);
});

// Rewrite routes to add /api prefix
server.use('/api', router);

const PORT = 4001;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
