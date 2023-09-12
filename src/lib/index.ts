import {
  blocks,
  blocksFill,
  emojis,
  normal,
  olde,
  oldeBold,
  script,
  scriptBold,
  squiggle,
  zalgo,
} from '../constants';

const arrayOfFonts = [
  blocks,
  blocksFill,
  emojis,
  normal,
  olde,
  oldeBold,
  script,
  scriptBold,
  squiggle,
  zalgo,
];

export function fontTransformer(char: string): string | null {
  try {
    const charIndex = arrayOfFonts.findIndex(font => font.includes(char));
    const fontClass = arrayOfFonts[charIndex] || emojis;
    const characterIndex = fontClass.indexOf(char);

    //checkIfcharacter is an emoji with regex
    if (emojis.includes(char)) {
      return null;
    }

    const unzalgo = char.replace(/[\u0300-\u036f]/g, '');
    if (charIndex === 2) {
      return null;
    }
    if (normal.includes(unzalgo)) {
      return unzalgo;
    }

    if (normal[characterIndex] === undefined) {
      return null;
    } else if (normal.includes(normal[characterIndex])) {
      return normal[characterIndex];
    }
    return null;
  } catch (error) {
    return '?';
  }
}

export const transformURI = (uri: string): string => {
  if (uri.includes('ipfs://')) {
    return uri.replace('ipfs://', 'https://dweb.link/ipfs/');
  }
  if (uri.includes('ar://')) {
    return uri.replace('ar://', 'https://arweave.net/');
  }
  return uri;
};

export const fetchImage = async (uri: string) => {
  try {
    const res = await fetch(uri);
    return await res.json();
  } catch (e) {
    console.log('Failed to fetch image:', e);
    return null;
  }
};
