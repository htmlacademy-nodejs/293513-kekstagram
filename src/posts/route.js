'use strict';

const express = require(`express`);
// eslint-disable-next-line new-cap
const postsRouter = express.Router();
const entity = require(`../generator/generate-entity`);
const NotFoundError = require(`../error/not-found-error`);
const IllegalArgumentError = require(`../error/illegal-argument-error`);

const DEFAULT_SKIP = 0;
const DEFAULT_LIMIT = 50;

const generateEntity = (count) => {
  const entities = [];

  for (let i = 0; i < count; i++) {
    entities.push(entity());
  }

  return entities;
};

const posts = generateEntity(DEFAULT_LIMIT);

postsRouter.get(``, (req, res) => {
  const skip = parseInt(req.query.skip, 10) || DEFAULT_SKIP;
  const limit = parseInt(req.query.limit, 10) || DEFAULT_LIMIT;
  const data = posts.slice(skip).slice(0, limit);
  res.send(data);
});

postsRouter.get(`/:date`, (req, res) => {
  const postDate = req.params.date;

  if (!postDate) {
    throw new IllegalArgumentError(`В запросе не указана дата.`);
  }

  const found = posts.find((it) => it.date === parseInt(postDate, 10));

  if (!found) {
    throw new NotFoundError(`Пост с такой датой "${postDate}" не найден.`);
  }

  res.send(found);
});

module.exports = {
  postsRouter,
  posts,
};
