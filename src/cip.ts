import { ethers } from "ethers";
import { cidNftAbi, addressRegistryAbi } from "./abi/abi";
import { CID_NFT_CONTRACT, ADDRESS_REGISTRY_CONTRACT } from "./constants";

const default_addresses = {
  cip: CID_NFT_CONTRACT,
  addressRegistry: ADDRESS_REGISTRY_CONTRACT,
};

export class Cip {
  provider: ethers.Provider;
  addresses: {cip: string, addressRegistry: string};
  cip: ethers.Contract;
  addressRegistry: ethers.Contract;

  constructor(provider: ethers.Provider, address_override?: {cip: string, addressRegistry: string}) {
    this.provider = provider;
    if (address_override != null) {
      this.addresses = address_override;
    } else {
      this.addresses = default_addresses;
    }
    this.cip = new ethers.Contract(
      this.addresses.cip,
      cidNftAbi,
      this.provider
    );
    this.addressRegistry = new ethers.Contract(
      this.addresses.addressRegistry,
      addressRegistryAbi,
      this.provider
    );
  }

  public async getPrimaryData(cid: bigint, subprotocolName: string): Promise<string> {
    try {
      const result = await this.cip.getPrimaryData(cid, subprotocolName);
      return result;
    } catch (error) {
      throw new Error(`Failed to get primary data for CID ${cid} and name ${subprotocolName}: ${error}`);
    }
  }

  public async getCid(address: `0x${string}`): Promise<bigint> {
    const result = await this.addressRegistry.getCID(address);
    return result;
  }

  private async getByAddress(address: `0x${string}`, getter: (string: any) => Promise<string>): Promise<string | null> {
    const cid = await this.getCid(address);
    if (cid == 0n) {
      return null;
    }
    return getter(cid);
  }

  public async getPFP(cid: bigint): Promise<string> {
    const result = await this.getPrimaryData(cid, 'pfp');
    return result;
  }

  public async getPFPByAddress(address: `0x${string}`): Promise<string | null> {
    return await this.getByAddress(address, this.getPFP);
  }

  public async getBio(cid: bigint): Promise<string> {
    const result = await this.getPrimaryData(cid, 'bio');
    return result;
  }

  public async getBioByAddress(address: `0x${string}`): Promise<string | null> {
    return await this.getByAddress(address, this.getBio);
  }

  public async getNamespace(cid: bigint): Promise<string> {
    const result = await this.getPrimaryData(cid, 'namespace');
    return result;
  }

  public async getNamespaceByAddress(address: `0x${string}`): Promise<string | null> {
    return await this.getByAddress(address, this.getNamespace);
  }
}