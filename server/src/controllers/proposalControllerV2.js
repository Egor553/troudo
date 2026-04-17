const proposalService = require('../services/proposalServiceV2');

const createProposal = async (req, res, next) => {
  try {
    const proposal = await proposalService.createProposal(req.user.id, req.body);
    res.status(201).json(proposal);
  } catch (e) {
    next(e);
  }
};

module.exports = { createProposal };
