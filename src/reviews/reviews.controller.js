const reviewsService = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const reviewExists = async (req, res, next) => {
  const review = await reviewsService.read(req.params.reviewId);
  if (review) {
    res.locals.review = review;
    return next();
  }
  next({ status: 404, message: "Review cannot be found." });
};

async function update(req, res) {
    const { review } = res.locals;
    const updatedReview = {
        ...req.body.data,
        review_id: req.params.reviewId
    };
    const data = await reviewsService.update(updatedReview);
    res.json({data});
    };



const destroy = async (req, res, next) => {
  await reviewsService.delete(res.locals.review.review_id);
  res.sendStatus(204);
};

module.exports = {
  update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
  delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
};