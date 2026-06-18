const express = require('express')
const router = express.Router()
const {
  createApplication, submitApplication,
  getMyApplications, getAllApplications, updateStatus
} = require('../controllers/application.controller')
const { protect, restrictTo } = require('../middleware/auth.middleware')

router.use(protect)

router.post('/', restrictTo('STUDENT'), createApplication)
router.get('/me', restrictTo('STUDENT'), getMyApplications)
router.get('/', restrictTo('ADMIN'), getAllApplications)
router.patch('/:id/submit', restrictTo('STUDENT'), submitApplication)
router.patch('/:id/status', restrictTo('ADMIN'), updateStatus)

module.exports = router