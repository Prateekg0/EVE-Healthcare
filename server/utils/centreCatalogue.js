import { readFileSync } from 'node:fs';

const filePath = new URL('../data/centres.json', import.meta.url);
export const centreCatalogue = JSON.parse(readFileSync(filePath, 'utf8'));

export function findCentreById(centreId) {
  return centreCatalogue.find(centre => centre._id === String(centreId));
}

export function findTestById(centre, testId) {
  return centre?.tests.find(test => test._id === String(testId));
}
