import { ethers } from 'ethers';
import { PFP_WRAPPER_CONTRACT } from '../constants';
import { pfpWrapperAbi } from '../abi/abi';
import {ProfilePictureData }from '../types';
import { BaseWeb3Contract } from './BaseWeb3Contract';

export class Pfp extends BaseWeb3Contract {
  constructor(provider: ethers.Provider) {
    super(provider, PFP_WRAPPER_CONTRACT, pfpWrapperAbi)
  }

  public async getPfpData(PfpCid: BigInt): Promise<ProfilePictureData> {
    try {
      const characters = await this.contract.pfp(PfpCid);
      return characters;
    } catch (error) {
      throw new Error(`Failed to get namespace characters. Error: ${error}`);
    }
  }
}
