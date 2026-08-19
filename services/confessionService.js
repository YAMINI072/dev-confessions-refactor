const CATEGORIES = ['bug', 'deadline', 'imposter', 'vibe-code']
const confessions = []
let nextConfessionId = 0

function validateConfessionInput(confessionData) {
  if (!confessionData) {
    return { status: 400, body: { msg: 'bad' } }
  }

  if (!confessionData.text) {
    return { status: 400, body: { msg: 'need text' } }
  }

  if (confessionData.text.length >= 500) {
    return { status: 400, body: { error: 'text too big, must be less than 500 characters long buddy' } }
  }

  if (confessionData.text.length <= 0) {
    return { status: 400, body: 'too short', send: true }
  }

  if (!CATEGORIES.includes(confessionData.category)) {
    return { status: 400, body: 'category not in stuff', send: true }
  }

  return null
}

function saveConfession(confessionData) {
  const savedConfession = {
    id: ++nextConfessionId,
    text: confessionData.text,
    category: confessionData.category,
    created_at: new Date()
  }

  confessions.push(savedConfession)
  return savedConfession
}

function getAllConfessions() {
  // Copy before sorting so a read request cannot mutate the storage order.
  const sortedConfessions = [...confessions].sort((first, second) => second.created_at - first.created_at)
  return { data: sortedConfessions, count: sortedConfessions.length }
}

function getConfessionById(confessionId) {
  return confessions.find((confession) => confession.id === confessionId)
}

function getConfessionsByCategory(category) {
  if (!CATEGORIES.includes(category)) {
    return null
  }

  return confessions.filter((confession) => confession.category === category).reverse()
}

function deleteConfessionById(confessionId) {
  const confessionIndex = confessions.findIndex((confession) => confession.id === confessionId)
  if (confessionIndex === -1) {
    return null
  }

  return confessions.splice(confessionIndex, 1)[0]
}

module.exports = {
  CATEGORIES,
  validateConfessionInput,
  saveConfession,
  getAllConfessions,
  getConfessionById,
  getConfessionsByCategory,
  deleteConfessionById
}
