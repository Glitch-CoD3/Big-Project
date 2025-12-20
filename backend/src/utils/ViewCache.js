// viewCache.js
let viewCounts = {}; // { videoId: count }
let seenUsers = {};  // { videoId: Set([userId1, userId2...]) }

export const incrementView = (videoId, userId) => {
  // Initialize the set for this video if it doesn't exist
  if (!seenUsers[videoId]) {
    seenUsers[videoId] = new Set();
  }

  // Check if this specific user has already viewed this video in this cycle
  if (seenUsers[videoId].has(userId)) {
    return false; // Not unique, do nothing
  }

  // If unique: add user to 'seen' and increment the counter
  seenUsers[videoId].add(userId);
  viewCounts[videoId] = (viewCounts[videoId] || 0) + 1;
  return true;
};

export const flushCache = () => {
  const snapshot = { ...viewCounts };

  // Reset both the counts and the seen users list
  viewCounts = {};
  seenUsers = {};

  return snapshot;
};

export default {
  incrementView,
  flushCache
};