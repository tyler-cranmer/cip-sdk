import { ethers } from 'ethers';
import {
  cidNftAbi,
  pfpWrapperAbi,
  addressRegistryAbi,
  bioAbi,
  nameSpaceAbi,
  erc721ABI,
} from '../abi/abi';
import {
  CID_NFT_CONTRACT,
  ADDRESS_REGISTRY_CONTRACT,
  BIO_CONTRACT,
  NAMESPACE_CONTRACT,
  PFP_WRAPPER_CONTRACT,
} from '../constants';
import { NameSpace, ProfilePictureData, ProfilePictureInfo } from '../types';
import { fetchImage, fontTransformer, transformURI } from '../lib';

export class CIP {
  provider: ethers.Provider;
  identityContract: ethers.Contract;
  registryContract: ethers.Contract;
  namespaceContract: ethers.Contract;
  bioContract: ethers.Contract;
  pfpContract: ethers.Contract;

  constructor(provider: ethers.Provider) {
    this.provider = provider;
    this.identityContract = new ethers.Contract(
      CID_NFT_CONTRACT,
      cidNftAbi,
      this.provider
    );
    this.registryContract = new ethers.Contract(
      ADDRESS_REGISTRY_CONTRACT,
      addressRegistryAbi,
      this.provider
    );
    this.namespaceContract = new ethers.Contract(
      NAMESPACE_CONTRACT,
      nameSpaceAbi,
      this.provider
    );
    this.bioContract = new ethers.Contract(BIO_CONTRACT, bioAbi, this.provider);
    this.pfpContract = new ethers.Contract(
      PFP_WRAPPER_CONTRACT,
      pfpWrapperAbi,
      this.provider
    );
  }

  public async getCID(address: string): Promise<BigInt> {
    try {
      const result: BigInt = await this.registryContract.getCID(address);
      return result;
    } catch (error) {
      throw new Error(`Failed to get the CID fpr ${address}`);
    }
  }

  public async getPrimaryData(
    cid: BigInt,
    subprotocolName: string
  ): Promise<BigInt> {
    try {
      const result: BigInt = await this.registryContract.getPrimaryData(
        cid,
        subprotocolName
      );
      return result;
    } catch (error) {
      throw new Error(
        `Failed to get primary data for CID ${cid} and name ${subprotocolName}.\nError: ${error}`
      );
    }
  }

  public async getNamespaceCID(cid: BigInt): Promise<BigInt> {
    try {
      const nCID: BigInt = await this.getPrimaryData(cid, 'namespace');
      return nCID;
    } catch (error) {
      throw new Error(
        `Failed to get namespaceCID from ${cid}.\nError: ${error}`
      );
    }
  }

  public async getPfpCID(cid: BigInt): Promise<BigInt> {
    try {
      const pfpCID: BigInt = await this.getPrimaryData(cid, 'profilepicture');
      return pfpCID;
    } catch (error) {
      throw new Error(`Failed to get pfpCID from ${cid}.\nError: ${error}`);
    }
  }

  public async getBioCID(cid: BigInt): Promise<BigInt> {
    try {
      const bioCID: BigInt = await this.getPrimaryData(cid, 'bio')
      return bioCID
    } catch (error) {
      throw new Error(`Failed to get bioCID from ${cid}.\nError: ${error}`)
    }
  }

  public async getNamespace(namespaceCID: BigInt): Promise<NameSpace> {
    let displayName: string;
    let baseName: string;
    try {
      const namespace: string[] = await this.namespaceContract.getNamespaceCharacters(
        namespaceCID
      );
      if (namespace.length) {
        displayName = namespace.join('');
        baseName = `${namespace.map(fontTransformer).join('')}.canto`;
        return { displayName, baseName };
      } else {
        displayName = '';
        baseName = '';
        return { displayName, baseName };
      }
    } catch (error) {
      throw new Error(
        `Failed to get user namespace from ${namespaceCID}.\nError: ${error}`
      );
    }
  }
/**
 * @description This method is used to get the ProfilePictureData to be used in the getPfpImage method.
 * @param pfpCID 
 * @returns 
 */
  public async getPfpData(pfpCID: BigInt): Promise<ProfilePictureData> {
    try {
      const profileData: ProfilePictureData = await this.pfpContract.pfp(
        pfpCID
      );
      return profileData;
    } catch (error) {
      throw new Error(
        `Failed to get user profile picture data from ${pfpCID}.\nError: ${error}`
      );
    }
  }

  public async getPfpImage(
    nftContractAddress: string,
    nftID: BigInt
  ): Promise<ProfilePictureInfo> {
    try {
      let pfp: ProfilePictureInfo = {
        src: '',
        alt: '',
        id: -1,
      };
      const nftContract = new ethers.Contract(
        nftContractAddress,
        erc721ABI,
        this.provider
      );
      const nftMeta: string = await nftContract.tokenURI(nftID);
      if (nftMeta) {
        const transformedURI = transformURI(nftMeta);
        try {
          const image: any = fetchImage(transformedURI);
          pfp.src = image.image;
          pfp.alt = image.name;
          pfp.id = image.id;
        } catch (error1) {
          throw new Error(
            `Failed to fetch the NFT data from ID:${nftID} and contact address: ${nftContractAddress}.\nError: ${error1} `
          );
        }
      }
      return pfp;
    } catch (error) {
      throw new Error(
        `Failed to get the NFT ID:${nftID} meta data from contact address: ${nftContractAddress}.\nError: ${error} `
      );
    }
  }

  public async getBio(bioCID: BigInt): Promise<string> {
    try {
      const bio: string = await this.bioContract.bio(bioCID)
      return bio
    } catch(error){
      throw new Error(`Failed to get bio from bioCID: ${bioCID}.\n Error: ${error}`)
    }
  }

  // private async getByAddress(address: `0x${string}`, getter: (string: any) => Promise<string>): Promise<string | null> {
  //   const cid = await this.getCID(address);
  //   if (cid == 0n) {
  //     return null;
  //   }
  //   return getter(cid);
  // }

  // public async getPFP(cid: bigint): Promise<string> {
  //   const result = await this.getPrimaryData(cid, 'pfp');
  //   return result;
  // }

  // public async getPFPByAddress(address: `0x${string}`): Promise<string | null> {
  //   return await this.getByAddress(address, this.getPFP);
  // }

  // public async getBio(cid: bigint): Promise<string> {
  //   const result = await this.getPrimaryData(cid, 'bio');
  //   return result;
  // }

  // public async getBioByAddress(address: `0x${string}`): Promise<string | null> {
  //   return await this.getByAddress(address, this.getBio);
  // }

  // public async getNamespace(cid: bigint): Promise<string> {
  //   const result = await this.getPrimaryData(cid, 'namespace');
  //   return result;
  // }

  // public async getNamespaceByAddress(address: `0x${string}`): Promise<string | null> {
  //   return await this.getByAddress(address, this.getNamespace);
  // }

  // public async getUserNamespace(address: `0x${string}`): Promise<string> {
  //   try {
  //     const userCID = await this.getCid(address)
  //     const namespaceCid = await this.getPrimaryData(userCID, "namespace")
  //     // This is where I would call cns class
  //     const namespace = await Cns.getNamespaceCharacters(namespaceCid)
  //     return namespace
  //   } catch(error){
  //     throw new Error("Failed")
  //   }
  // }
}
