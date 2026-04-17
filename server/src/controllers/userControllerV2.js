const profileService = require('../services/profileService');

const getProfile = async (req, res, next) => {
  try {
    const profile = await profileService.getProfile(req.user.id);
    res.json(profile);
  } catch (e) {
    next(e);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const profile = await profileService.updateProfile(req.user.id, req.body);
    res.json(profile);
  } catch (e) {
    next(e);
  }
};

const switchRole = async (req, res, next) => {
  try {
    const profile = await profileService.switchRole(req.user.id, req.body.role);
    res.json(profile);
  } catch (e) {
    next(e);
  }
};

module.exports = { getProfile, updateProfile, switchRole };
