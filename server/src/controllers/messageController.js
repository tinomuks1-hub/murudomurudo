const pool = require('../config/db');

const sendMessage = async function(req, res) {
  const senderId = req.user.id;
  const receiverId = req.params.id;
  const { content } = req.body;
  try {
    const message = await pool.query(
      'INSERT INTO messages (sender_id, receiver_id, content) VALUES ($1, $2, $3) RETURNING *',
      [senderId, receiverId, content]
    );
    res.status(201).json(message.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMessages = async function(req, res) {
  const userId = req.user.id;
  const otherId = req.params.id;
  try {
    const messages = await pool.query(
      `SELECT * FROM messages WHERE (sender_id=$1 AND receiver_id=$2) OR (sender_id=$2 AND receiver_id=$1) ORDER BY created_at ASC`,
      [userId, otherId]
    );
    res.json(messages.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { sendMessage: sendMessage, getMessages: getMessages };