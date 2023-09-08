import { ethers } from "ethers";
import { cidNftAbi } from "../abi/abi";
import { CID_NFT_CONTRACT } from "../constants";
// import {NameSpace }from '../src/types';
import { BaseWeb3Contract } from "../classes/BaseWeb3Contract";
import { AddressRegistry } from "../AddressRegistry";

export class Cip2 extends BaseWeb3Contract{
  constructor(provider: ethers.Provider) {
    super(provider, CID_NFT_CONTRACT, cidNftAbi)
  }

  public async getPrimaryData(cid: bigint, subprotocolName: string): Promise<string> {
    try {
      const result = await this.contract.getPrimaryData(cid, subprotocolName);
      return result;
    } catch (error) {
      throw new Error(`Failed to get primary data for CID ${cid} and name ${subprotocolName}: ${error}`);
    }
  }

  private async getByAddress(address: `0x${string}`, getter: (string: any) => Promise<string>): Promise<string | null> {
    const cid = await this.getCID(address);
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

  public async getUserNamespace(address: `0x${string}`): Promise<string> {
    try {
      const userCID = await this.getCid(address)
      const namespaceCid = await this.getPrimaryData(userCID, "namespace")
      // This is where I would call cns class
      const namespace = await Cns.getNamespaceCharacters(namespaceCid)
      return namespace
    } catch(error){
      throw new Error("Failed")
    }
  }

  public async getCID(address: `0x${string}`, addressRegistryInstance: AddressRegistry): Promise<BigInt> {
    try {
      const result = await addressRegistryInstance.getCID(address);
      return result;
    } catch (error) {
      throw new Error(`Failed to get the CID fpr ${address}`);
    }

  }

}