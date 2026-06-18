const express = require('express')
const router = express.Router()
const {
  getUniversities, getUniversity,
  createUniversity, updateUniversity, deleteUniversity
} = require('../controllers/university.controller')
const { protect, restrictTo } = require('../middleware/auth.middleware')

router.get('/', getUniversities)
router.get('/:id', getUniversity)
router.post('/', protect, restrictTo('ADMIN'), createUniversity)
router.put('/:id', protect, restrictTo('ADMIN'), updateUniversity)
router.delete('/:id', protect, restrictTo('ADMIN'), deleteUniversity)

module.exports = router