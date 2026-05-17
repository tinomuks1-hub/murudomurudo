const pool = require('../config/db');

const likeUser = async function(req, res) {
  const likerId = req.user.id;
  const likedId = req.params.id;
  try {
    const existing = await pool.query(
      'SELECT * FROM likes WHERE liker_id=$1 AND liked_id=$2',
      [likerId, likedId]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Already liked this user' });
    }
    await pool.query(
      'INSERT INTO likes (liker_id, liked_id) VALUES ($1, $2)',
      [likerId, likedId]
    );
    const mutualLike = await pool.query(
      'SELECT * FROM likes WHERE liker_id=$1 AND liked_id=$2',
      [likedId, likerId]
    );
    if (mutualLike.rows.length > 0) {
      await pool.query(
        'INSERT INTO matches (user1_id, user2_id, status) VALUES ($1, $2, $3)',
        [likerId, likedId, 'matched']
      );
      return res.json({ message: "It's a match! 🎉", matched: true });
    }
    res.json({ message: 'Like sent!', matched: false });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMatches = async function(req, res) {
  try {
    const matches = await pool.query(
      `SELECT u.id, u.name, u.university, u.major, u.year, u.bio, u.profile_photo
       FROM matches m
       JOIN users u ON (
         CASE 
           WHEN m.user1_id = $1 THEN u.id = m.user2_id
           ELSE u.id = m.user1_id
         END
       )
       WHERE (m.user1_id = $1 OR m.user2_id = $1) AND m.status = 'matched'`,
      [req.user.id]
    );
    res.json(matches.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { likeUser: likeUser, getMatches: getMatches };