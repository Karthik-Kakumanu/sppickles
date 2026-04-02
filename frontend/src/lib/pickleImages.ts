const pickleAsset = (fileName: string) => new URL(`../../pickles/${fileName}`, import.meta.url).href;

export const pickleAvakaya = pickleAsset("Gemini_Generated_Image_6h7b3z6h7b3z6h7b.png");
export const pickleGongura = pickleAsset("pandu mirchi gongura.png");
export const pickleLemon = pickleAsset("nimmakaya pickle.png");
export const catSaltPickles = pickleAsset("chinthakaya pickle.png");
export const catTemperedPickles = pickleAsset("dried avakayi pickle.png");
export const tomatoPickle = pickleAsset("tomato pickle.png");
export const vellakayaPickle = pickleAsset("vellakaya pickle.png");
export const velluliAvakayaPickle = pickleAsset("velluli avakayi pickle.png");
export const panduMirchiChintakayaPickle = pickleAsset("pandu mirchi chinthakaya.png");

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
