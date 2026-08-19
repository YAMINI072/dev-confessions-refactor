const express = require('express')
const {
  createConfession,
  listConfessions,
  getConfession,
  listConfessionsByCategory,
  deleteConfession
} = require('../controllers/confessionController')

const router = express.Router()

router.post('/', createConfession)
router.get('/', listConfessions)
router.get('/category/:cat', listConfessionsByCategory)
router.get('/:id', getConfession)
router.delete('/:id', deleteConfession)

module.exports = router
