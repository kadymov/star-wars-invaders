export interface ImgResDeclaration {
  [objName: string]: string | string[] | {url: string, tileWidth: number, tileHeight: number}
}

export interface ImgResOutput {
  [objName: string]: ImageBitmap[]
}

const loadImage = (url: string): Promise<ImageBitmap> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(createImageBitmap(img));
    img.onerror = (e) => reject(e);
    img.src = url;
  });
}

const loadImagesArray = (urls: string[]): Promise<ImageBitmap[]> => {
  return Promise.all(urls.map(loadImage))
}

const loadTileset = async (url: string, tileWidth: number, tileHeight: number) => {
  const image = await loadImage(url);
  const canvas = document.createElement('canvas');
  canvas.width = tileWidth;
  canvas.height = tileHeight;
  const ctx = canvas.getContext('2d');

  if (!ctx) return [];

  const imagesArray: ImageBitmap[] = [];

  for (let y = 0; y < image.height; y += tileHeight) {
    for (let x = 0; x < image.width; x += tileWidth) {
      ctx.clearRect(0, 0, tileWidth, tileHeight);
      ctx.drawImage(image, x, y, tileWidth, tileHeight, 0, 0, tileWidth, tileHeight);
      imagesArray.push(await createImageBitmap(canvas));
    }
  }

  return imagesArray;
}

export class Loader {
  static async loadImages(
    imgUrlObj: ImgResDeclaration
  ): Promise<ImgResOutput> {
    const result: ImgResOutput = {};

    for (const name of Object.keys(imgUrlObj)) {
      const source = imgUrlObj[name];

      if (Array.isArray(source)) {
        result[name] = await loadImagesArray(source);
      } else if (typeof source === 'string') {
        result[name] = [await loadImage(source)];
      } else {
        const {url, tileWidth, tileHeight} = source;
        result[name] = await loadTileset(url, tileWidth, tileHeight);
      }
    }

    return result;
  }
}