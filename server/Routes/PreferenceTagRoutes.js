const express = require('express');
const router = express.Router();
const preferenceTagController = require('../Controllers/PreferenceTagController');

//must use url then /api/prefrenceTag
router.post('/preferenceTag', preferenceTagController.createPreferenceTag);
router.get('/preferenceTags', preferenceTagController.getPreferenceTags);
router.put('/preferenceTag', preferenceTagController.updatePreferenceTag); // No :id in the URL
router.delete('/preferenceTag', preferenceTagController.deletePreferenceTag); // No :id in the URL

module.exports = router;
