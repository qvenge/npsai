const fs = require('node:fs');

/*
Component - An arrangement of published UI elements that can be instantiated across figma files

key: String - The unique identifier of the component

file_key: String - The unique identifier of the figma file which contains the component

node_id: String - ID of the component node within the figma file

thumbnail_url: String - URL link to the component's thumbnail image

name: String - Name of the component

description: String - The description of the component as entered by the publisher

created_at: String - The UTC ISO 8601 time at which the component was created

updated_at: String - The UTC ISO 8601 time at which the component was updated

user: User - The user who last updated the component

containing_frame: FrameInfo default: {} - Data on component's containing frame, if component resides within a frame
*/

const FIGMA_TOKEN = 'твой токен';

const FILE_KEY = 'sVVO4xNIrhu8aT8DJ5RThz';

const out_dir = 'src/5_shared/ds/icons';

(async () => {
  const namesById = await getIconNodeIds();
  console.log(namesById.size, 'node IDs of icons fetched');
  const urlsByName = await getIconUrls(namesById);
  console.log(urlsByName.size, 'urls of icons fetched');
  const iconsByName = await getImages(urlsByName);
  console.log(iconsByName.size, 'icons fetched');
  const saved = await saveImages(iconsByName);
  console.log(saved.length, 'icons saved');
})();

async function getIconNodeIds() {
  const data = await request(`files/${FILE_KEY}/components`);
  const components = data.meta.components;
  const iconIds = new Map();
  
  for (let i = 0; i < components.length; i++) {
    const component = components[i];
    
    if (component.containing_frame?.pageName === 'Icons') {
      if (component.containing_frame.name == null) {
        console.log(`Icon component has no name: ${component.node_id}`);
      }

      if (!component.name.startsWith('Weight')) {
        console.log(`Icon component ${component.node_id} has no weight: ${component.name}`);
      }

      if (iconIds.has(component.node_id)) {
        console.log(`Duplicate icon component: ${component.node_id}`);
      }

      const name = dashirize(component.containing_frame.name);
      const weight = component.name.split('=')[1].trim().toLowerCase();

      iconIds.set(component.node_id, `${name}_${weight}`);
    }
  }

  return iconIds;
}

async function getIconUrls(namesById) {
  const urlsByName = new Map();
  const batchSize = 100;
  const allIds = Array.from(namesById.keys());

  for (let i = 0; i < allIds.length; i += batchSize) {
    const ids = allIds.slice(i, i + batchSize).join(',');
    const data = await request(`images/${FILE_KEY}?ids=${ids}&format=svg&use_absolute_bounds=true`);

    if (data.err) {
      throw new Error(data.err);
    }

    Object.entries(data.images).forEach(([id, url]) => {
      urlsByName.set(namesById.get(id), url);
    });
  }

  return urlsByName;
}

async function getImages(urlsByName) {
  const iconsByName = new Map();

  await callWithLimit(
    async (name, url) => {
      const res = await fetch(url);

      if (res.status !== 200) {
        console.log(`Failed to fetch icon ${name}: ${res.status} ${res.statusText}`);
      }

      iconsByName.set(name, await res.text());
    },
    Array.from(urlsByName.entries()),
    5
  );

  return iconsByName;
}

function saveImages(iconsByName) {
  // if (!fs.existsSync('icons')) {
  //   fs.mkdirSync('icons');
  // }

  return callWithLimit(
    writeFile,
    Array.from(iconsByName.entries()).map(([name, data]) => [`${out_dir}/${name}.svg`, data]),
    10
  );
}

function request(url) {
  return fetch(`https://api.figma.com/v1/${url}`, {
    headers: {
      'X-Figma-Token': FIGMA_TOKEN,
    }
  }).then((res) => {
    if (res.status !== 200) {
      throw new Error(`Request failed with status ${res.status}: ${res.statusText}`);
    }

    return res.json();
  });
}

function callWithLimit(fanc, args, limit = 5) {
  return new Promise((resolve) => {
    const results = [];
    let pointer = 0;
  
    for (; pointer < args.length && pointer < limit; ++pointer) {
      callAndInsert(pointer);
    }

    function callAndInsert(index) {
      results[index] = fanc.apply(null, Array.isArray(args[index]) ? args[index] : [args[index]])
        .finally(() => {
          pointer++;
      
          if (pointer < args.length) {
            callAndInsert(pointer);
          } else {
            resolve(Promise.allSettled(results));
          }
        })
    }
  });
}

function dashirize(value) {
  return value
    // 1. Вставляем дефис между маленькой буквой/цифрой и большой буквой
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    // 2. Вставляем дефис между последовательностью заглавных и следующей Большой+маленькой
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    // 3. Меняем все подчёркивания и пробелы на дефисы
    .replace(/[_\s]+/g, '-')
    // 4. Переводим в нижний регистр
    .toLowerCase();
}

function writeFile(filename, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, data, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
