const express = require('express');
const router = express.Router();
const preferenceTagController = require('../Controllers/PreferenceTagController');

//must use url then /api/prefrenceTag
router.post('/createTag', preferenceTagController.createPreferenceTag);
router.get('/getpreferenceTags', preferenceTagController.getPreferenceTags);
router.put('/updateTag', preferenceTagController.updatePreferenceTag); // No :id in the URL
router.delete('/deleteTag', preferenceTagController.deletePreferenceTag); // No :id in the URL
router.put('/updateTouristPref/:touristId', preferenceTagController.updateTouristPreferences);

module.exports = router;
