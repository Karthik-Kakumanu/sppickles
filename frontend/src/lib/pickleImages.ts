const pickleAsset = (relativePath: string) => new URL(`../../images/${relativePath}`, import.meta.url).href;

export const pickleAvakaya = pickleAsset("pickles-tempered/avakaya.jpg");
export const pickleGongura = pickleAsset("pickles-tempered/pandumirchi-gongura.jpg");
export const pickleLemon = pickleAsset("pickles-uppu/lemon.jpg");
export const catSaltPickles = pickleAsset("pickles-tempered/avakaya.jpg");
export const catTemperedPickles = pickleAsset("pickles-uppu/chintakaya-thokku.jpg");
export const tomatoPickle = pickleAsset("pickles-uppu/tomato.jpg");
export const vellakayaPickle = pickleAsset("pickles-uppu/velakkaya.JPG");
export const velluliAvakayaPickle = pickleAsset("pickles-tempered/garlic-avakaya.jpg");
export const panduMirchiChintakayaPickle = pickleAsset("pickles-tempered/pandumirchi-chintakaya.jpg");

export const resolvePickleImage = (name: string) => {
  const normalized = name.toLowerCase();

  if (normalized.includes("pandumirchi chintakaya")) {
    return panduMirchiChintakayaPickle;
  }

  if (normalized.includes("gongura")) {
    return pickleGongura;
  }

  if (normalized.includes("chintakaya")) {
    return catSaltPickles;
  }

  if (normalized.includes("vellulli") || normalized.includes("garlic")) {
    return velluliAvakayaPickle;
  }

  if (normalized.includes("vellakaya") || normalized.includes("velakkaya")) {
    return vellakayaPickle;
  }

  if (normalized.includes("tomato")) {
    return tomatoPickle;
  }

  if (normalized.includes("nimm") || normalized.includes("lemon") || normalized.includes("dabbakaya")) {
    return pickleLemon;
  }

  if (normalized.includes("dry") || normalized.includes("endu") || normalized.includes("menthi")) {
    return catTemperedPickles;
  }

  return pickleAvakaya;
};
