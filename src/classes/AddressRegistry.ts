import { BaseWeb3Contract } from './BaseWeb3Contract';
import { ethers } from 'ethers';
import { addressRegistryAbi } from '../abi/abi';
import { ADDRESS_REGISTRY_CONTRACT } from '../constants';


export class AddressRegistry extends BaseWeb3Contract {
  constructor(provider: ethers.Provider) {
    super(provider, ADDRESS_REGISTRY_CONTRACT, addressRegistryAbi);
  }

  public async getCID(address: string): Promise<BigInt> {
    try {
      const cid = await this.contract.getCID(address);
      return cid;
    } catch (error) {
      throw new Error(`Failed to get the CID for ${address}`);
    }
  }
}
