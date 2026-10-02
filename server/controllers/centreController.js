import mongoose from 'mongoose';
import { centreCatalogue } from '../utils/centreCatalogue.js';

export function getCentres(req, res) {
  const { q, category } = req.query;

  const searchTerm = String(q || '')
    .trim()
    .slice(0, 60)
    .toLocaleLowerCase();

  const normalizedSearch = searchTerm.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');

  const searchPattern = new RegExp(normalizedSearch, 'i');

  const centres = centreCatalogue
    .filter(centre => {
      const matchesCategory =
        !category ||
        category === 'All tests' ||
        centre.tests.some(test => test.category === category);

      const matchesSearch =
        !searchTerm ||
        searchPattern.test(centre.name) ||
        searchPattern.test(centre.location) ||
        centre.tests.some(test => searchPattern.test(test.name));

      return matchesCategory && matchesSearch;
    })
    .map(centre => {
      const centreMatches =
        !searchTerm ||
        searchPattern.test(centre.name) ||
        searchPattern.test(centre.location);

      return {
        ...centre,
        tests: centre.tests.filter(test => {
          const matchesCategory =
            !category ||
            category === 'All tests' ||
            test.category === category;

          const matchesSearch =
            !searchTerm ||
            centreMatches ||
            searchPattern.test(test.name) ||
            searchPattern.test(test.category);

          return matchesCategory && matchesSearch;
        }),
      };
    });

  res.json({ centres });
}

export function getCentreById(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({
      message: 'Invalid centre ID.',
    });
  }

  const centre = centreCatalogue.find(
    item => item._id === req.params.id
  );

  if (!centre) {
    return res.status(404).json({
      message: 'Centre not found.',
    });
  }

  res.json({ centre });
}