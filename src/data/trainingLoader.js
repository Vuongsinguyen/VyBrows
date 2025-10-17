import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

// Load all training JSON files from the training directory
const trainingDir = join(process.cwd(), 'src/content/training');
const files = readdirSync(trainingDir).filter(file => file.endsWith('.json'));

export const trainingData = files.map(file => {
  const content = readFileSync(join(trainingDir, file), 'utf-8');
  return JSON.parse(content);
});

export default trainingData;
