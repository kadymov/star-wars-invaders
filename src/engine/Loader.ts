export interface ImgResDeclaration {
  [objName: string]: string | string[]
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

export class Loader {
  static async loadImages(
    imgUrlObj: ImgResDeclaration
  ): Promise<ImgResOutput> {
    const result: ImgResOutput = {};

    for (const name of Object.keys(imgUrlObj)) {
      const urls = imgUrlObj[name];
      const urlsArr: string[] = Array.isArray(urls)
        ? urls
        : [urls];

      result[name] = await loadImagesArray(urlsArr);
    }

    return result;
  }
}