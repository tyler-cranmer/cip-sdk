import { ethers } from 'ethers';
import {
  cidNftAbi,
  pfpWrapperAbi,
  addressRegistryAbi,
  bioAbi,
  nameSpaceAbi,
  erc721ABI,
  subprotocolRegistryAbi,
} from '../src/abi/abi';
import {
  CID_NFT_CONTRACT,
  ADDRESS_REGISTRY_CONTRACT,
  BIO_CONTRACT,
  NAMESPACE_CONTRACT,
  PFP_WRAPPER_CONTRACT,
  SUBPROTOCOL_REGISTRY_CONTRACT,
} from '../src/constants';
import { NameSpace, ProfilePictureData, ProfilePictureInfo } from '../src/types';
import { fetchImage, fontTransformer, transformURI } from '../src/lib';

export class CIP {
  provider: ethers.Provider;
  web3Provider?: ethers.BrowserProvider;
  signer?: ethers.JsonRpcSigner;
  identityContract: ethers.Contract;
  registryContract: ethers.Contract;
  namespaceContract: ethers.Contract;
  bioContract: ethers.Contract;
  pfpContract: ethers.Contract;
  subprotocolCrontract: ethers.Contract;

  constructor(
    provider: ethers.Provider,
    web3Provider?: ethers.BrowserProvider
  ) {
    this.provider = provider;
    this.web3Provider = web3Provider;
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
    if (web3Provider) {
      // @ts-ignore
      this.signer = web3Provider.getSigner();
      this.subprotocolCrontract = new ethers.Contract(
        SUBPROTOCOL_REGISTRY_CONTRACT,
        subprotocolRegistryAbi,
        this.signer
      );
    } else {
      this.subprotocolCrontract = new ethers.Contract(
        SUBPROTOCOL_REGISTRY_CONTRACT,
        subprotocolRegistryAbi,
        this.provider
      );
    }

    this.getBio = this.getBio.bind(this);
    this.getNamespace = this.getNamespace.bind(this);
  }

  /**
   * @notice Register a new subprotocol. There is a 100 $NOTE fee when registering
   *  @dev The options ordered, primary, active are not mutually exclusive. In practice, only one will be set for most subprotocols,
   *  but if a subprotocol for instance supports int keys (mapped to one value) and a list of active NFTs, ordered and active is true.
   * @param ordered Ordering allows integers to be used as map keys, to one and only one value
   * @param primary Primary maps to zero or one value
   * @param active Subprotocols that have a list of a active NFTs
   * @param address Name of the subprotocol, has to be unique
   * @param name Address of the subprotocol NFT.
   * @param fee Fee (in $NOTE) for minting a new token of the subprotocol. Set to 0 if there is no fee. 10% is subtracted from this fee as a CID fee
   * @returns
   */
  public async registerSubprotocol(
    ordered: boolean,
    primary: boolean,
    active: boolean,
    address: string,
    name: string,
    fee: BigInt
  ) {
    if (this.web3Provider) {
      try {
        const tx = await this.subprotocolCrontract.register(
          ordered,
          primary,
          active,
          address,
          name,
          fee
        );
        const reciept = await tx.wait();
        console.log('Transaction sent:', tx);
        return reciept;
      } catch (error) {
        console.log('error calling register:', error);
        throw new Error(`Failed to create sub protocol. Error: ${error}`);
      }
    } else {
      throw new Error(`Connect a Web3 provider like meta mask.`);
    }
  }

  /**
   * getCID is a method that calls the Canto Identity registration contract and returns the CID NFT ID that is registered to the provided address.
   * The CID NFT ID can be used to get a users sub protocol NFT IDs.
   * @param address Address to query.
   * @returns The CID NFT ID of the provided address.
   */
  public async getCID(address: string): Promise<BigInt> {
    try {
      const result: BigInt = await this.registryContract.getCID(address);
      return result;
    } catch (error) {
      throw new Error(`Failed to get the CID for ${address}.\nError: ${error}`);
    }
  }

  /**
   * getPrimaryData is a method that is used to get the users sub protocol NFT IDs of any subprotocol registered with the user's CID.
   * This method is used to return any of the users registered sub protocol NFT IDs.
   * The return value can be used to get a user's sub protocol data. i.e. namespace or bio information.
   *
   * @param cid User's CID NFT ID - Can be obtained by using getCID method.
   * @param subprotocolName the sub protocol name to query. Current list of sub protocols [namespace, profilepicture, bio]
   * @returns subProtocol registered NFT ID.
   */
  public async getPrimaryData(
    cid: BigInt,
    subprotocolName: string
  ): Promise<BigInt> {
    try {
      const result: BigInt = await this.identityContract.getPrimaryData(
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

  /**
   * getNamespaceCID is a method that returns the user's registered namespace NFT ID.
   * The return value is used by getNamespace() to retrieve the user's namespace data.
   * @param cid User's CID NFT ID. see getCID() for more information.
   * @returns User's Namespace NFT ID
   */
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

  /**
   * getPfpCID is a method that is used to return a user's registered pfp NFT ID.
   * the return value is used by getPfpData() to get a user's profile picture information.
   * @param cid User's CID NFT ID. see getCID() for more information.
   * @returns User's pofile picture NFT ID
   */
  public async getPfpCID(cid: BigInt): Promise<BigInt> {
    try {
      const pfpCID: BigInt = await this.getPrimaryData(cid, 'profilepicture');
      return pfpCID;
    } catch (error) {
      throw new Error(`Failed to get pfpCID from ${cid}.\nError: ${error}`);
    }
  }

  /**
   * getBioCID is a method that is used to return a user's registered bio NFT ID.
   * the return value is used by getBio() to get a user's bio information.
   * @param cid User's CID NFT ID. see getCID() for more information.
   * @returns User's bio NFT ID
   */
  public async getBioCID(cid: BigInt): Promise<BigInt> {
    try {
      const bioCID: BigInt = await this.getPrimaryData(cid, 'bio');
      return bioCID;
    } catch (error) {
      throw new Error(`Failed to get bioCID from ${cid}.\nError: ${error}`);
    }
  }

  /**
   * getNamespace is a method that return a user's registered Namespace displayName and baseName.
   * @param namespaceCID User's registered namespace NFT ID. see getPrimaryData() or getNamespaceCID()
   * @returns Namespace Information in the form of display and base name. ex. displayName = 0xteewhy, baseName = 0xteewhy.canto
   */
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
   * This method is used to get the ProfilePictureData to be used in the getPfpImage method.
   * @param pfpCID - pfpCID comes from the getPfpCid()
   * @returns ProfilePictureData = [string, BigInt]. Profile Picture data is the NFT contract and ID of the users profile picture.
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

  /**
   * getPfpImage is a method that returns the profile prcture info/
   * @param nftContractAddress NFT contract address of the pfp
   * @param nftID NFT ID
   * @returns ProfilePictureInfo = {
   * src = link
   * alt = nft name
   * }
   */
  public async getPfpImage(
    nftContractAddress: string,
    nftID: BigInt
  ): Promise<ProfilePictureInfo> {
    try {
      let pfp: ProfilePictureInfo = {
        src: '',
        alt: '',
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
          const image: any = await fetchImage(transformedURI);
          pfp.src = image.image;
          pfp.alt = image.name;
        } catch (error1) {
          throw new Error(
            `Failed to fetch the NFT image data from ID:${nftID} and contact address: ${nftContractAddress}.\nError1: ${error1} `
          );
        }
      }
      return pfp;
    } catch (error) {
      throw new Error(
        `Failed to get the NFT ID:${nftID} meta data from contact address: ${nftContractAddress}.\nError2: ${error} `
      );
    }
  }

  /**
   * getBio is a method that returns the bio associated with a CID
   * @param bioCID bioCID. Comes from getBioCID()
   * @returns a string form of the bio. 
   */
  public async getBio(bioCID: BigInt): Promise<string> {
    try {
      const bio: string = await this.bioContract.bio(bioCID);
      return bio;
    } catch (error) {
      throw new Error(
        `Failed to get bio from bioCID: ${bioCID}.\n Error: ${error}`
      );
    }
  }

  /**
   * getByAddress is a private helper method that is used for getBioByAddress, getNamespaceByAddress
   * @param address user address
   * @param subprotocolName the sub protocol name 
   * @param getter callback function
   * @returns
   */
  private async getByAddress(
    address: string,
    subprotocolName: string,
    getter: (string: any) => Promise<any>
  ): Promise<BigInt | null> {
    try {
      const cid: BigInt = await this.getCID(address);
      if (cid == 0n) {
        throw new Error(`Address: ${address} does not have a registered CID.`);
      } else {
        const subProtocol = await this.getPrimaryData(cid, subprotocolName);
        return getter(subProtocol);
      }
    } catch (error) {
      throw new Error(`Failed getByAddress: ${error}`);
    }
  }

  /**
   * getBioByAddress is a method that gets the users bio 
   * @param address user address
   * @returns the users bio in string format
   */
  public async getBioByAddress(address: string): Promise<any> {
    return await this.getByAddress(address, 'bio', this.getBio);
  }

  /**
   * getNamespaceByAddress is a method that gets the user's namspace information. 
   * @param address user address
   * @returns a namspace object that contains displayName and baseName in string format.
   */
  public async getNamespaceByAddress(address: string): Promise<any> {
    return await this.getByAddress(address, 'namespace', this.getNamespace);
  }

  /**
   * getPfpByAddress is a method that gets the user's pfp data by using their address.
   * @param address user's address
   * @returns ProfilePictureInfo object -> {
   * src (string) : image url,
   * alt (string) : image name
   * }
   */
  public async getPfpByAddress(address: string): Promise<ProfilePictureInfo> {
    try {
      const cid = await this.getCID(address);
      const pfpCID = await this.getPfpCID(cid);
      const [contract, id] = await this.getPfpData(pfpCID);
      const pfp = await this.getPfpImage(contract, id);
      return pfp;
    } catch (error) {
      throw new Error(
        `Failed to get pfp data from address: ${address}.\n Error: ${error}`
      );
    }
  }
}
