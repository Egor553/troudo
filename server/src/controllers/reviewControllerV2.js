const reviewService = require('../services/reviewServiceV2');

const createReview = async (req, res, next) => {
  try {
    const review = await reviewService.createReview(req.user.id, req.body);
    res.status(201).json(review);
  } catch (e) {
    next(e);
  }
};

const getReviews = async (req, res, next) => {
  try {
    const reviews = await reviewService.getReviews(req.query);
    res.json(reviews);
  } catch (e) {
    next(e);
  }
};

module.exports = { createReview, getReviews };
