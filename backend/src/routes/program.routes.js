const express = require('express')
const router = express.Router()
const {
  getPrograms, getProgram, getCategories,
  createProgram, updateProgram, deleteProgram
} = require('../controllers/program.controller')
const { protect, restrictTo } = require('../middleware/auth.middleware')

router.get('/categories', getCategories)
router.get('/', getPrograms)
router.get('/:id', getProgram)
router.post('/', protect, restrictTo('ADMIN'), createProgram)
router.put('/:id', protect, restrictTo('ADMIN'), updateProgram)
router.delete('/:id', protect, restrictTo('ADMIN'), deleteProgram)

module.exports = router