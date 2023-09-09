import { ethers } from "ethers";
import { BaseWeb3Contract } from "./BaseWeb3Contract";
import { BIO_CONTRACT } from "../constants";
import { bioAbi } from "../abi/abi";

export class BIO extends BaseWeb3Contract {
    constructor(provider: ethers.Provider) {
        super(provider, BIO_CONTRACT, bioAbi)
    }

    public async getBio(BioCID: BigInt): Promise<string> {
       try{
        const bio = await this.contract.bio(BioCID);
        return bio
       } catch (error){
        throw new Error(`Failed to get a bio from ${BioCID}. Error: ${error}`)
       }

    }
}