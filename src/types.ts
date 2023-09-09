export type NameSpace = {
  displayName: string;
  baseName: string;
};

export type ProfilePictureData = {
  // referene to the NFT contract
  nftContract: string;
  // referenced NFT ID
  nftID: BigInt;
};

export type ProfilePictureInfo = {
  src: string;
  alt: string;
  id: number;
};
