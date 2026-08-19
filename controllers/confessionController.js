const {
  validateConfessionInput,
  saveConfession,
  getAllConfessions,
  getConfessionById,
  getConfessionsByCategory,
  deleteConfessionById
} = require('../services/confessionService')
const { deleteToken } = require('../config/env')

function sendResult(response, result) {
  if (result.send) {
    return response.status(result.status).send(result.body)
  }
  return response.status(result.status).json(result.body)
}

function createConfession(request, response) {
  const validationError = validateConfessionInput(request.body)
  if (validationError) {
    return sendResult(response, validationError)
  }

  const savedConfession = saveConfession(request.body)
  console.log(`added one info ${savedConfession.id}`)
  return response.status(201).json(savedConfession)
}

function listConfessions(request, response) {
  const result = getAllConfessions()
  console.log('fetching all data result')
  return response.json(result)
}

function getConfession(request, response) {
  const confessionId = Number.parseInt(request.params.id, 10)
  const confession = getConfessionById(confessionId)

  if (!confession) {
    return response.status(404).json({ msg: 'not found' })
  }

  if (!confession.text) {
    return response.status(500).send('broken')
  }

  console.log(`found info with ${confession.text.length} chars`)
  return response.json(confession)
}

function listConfessionsByCategory(request, response) {
  const categoryConfessions = getConfessionsByCategory(request.params.cat)
  if (categoryConfessions === null) {
    return response.status(400).json({ msg: 'invalid category' })
  }

  return response.json(categoryConfessions)
}

function deleteConfession(request, response) {
  if (request.headers['x-delete-token'] !== deleteToken) {
    return response.status(403).json({ msg: 'no permission' })
  }

  if (!request.params.id) {
    return response.status(400).send('no id')
  }

  const confessionId = Number.parseInt(request.params.id, 10)
  const deletedConfession = deleteConfessionById(confessionId)
  if (!deletedConfession) {
    return response.status(404).json({ msg: 'not found buddy' })
  }

  console.log('deleted something')
  return response.json({ msg: 'ok', item: deletedConfession })
}

module.exports = {
  createConfession,
  listConfessions,
  getConfession,
  listConfessionsByCategory,
  deleteConfession
}
