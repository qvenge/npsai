import { readdir, writeFile } from 'node:fs/promises';

try {
  const files = await readdir('src/5_shared/ds/icons/20');

  const namesAndPaths = [];

  for (const file of files) {
    if (file.endsWith('.svg')) {
      const name = toCamelCase(file.replace('.svg', ''));
      namesAndPaths.push([name, `@/shared/ds/icons/20/${file}`]);
    }
  }
  
  writeFile(
    './src/5_shared/ds/icons/index.ts',
    namesAndPaths.map(([name, path]) => `export { default as ${name} } from '${path}';`).join('\n'));
} catch (err) {
  console.error(err);
}

function toCamelCase(str) {
  return str
    .toLowerCase() // всё в нижний регистр для однозначности
    .replace(/[-_]+(.)?/g, (match, chr) => chr ? chr.toUpperCase() : '')
    .replace(/^./, match => match.toUpperCase()); // делаем первую букву заглавной
}