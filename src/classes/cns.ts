import { ethers } from "ethers";
import { NAMESPACE_CONTRACT } from "../constants";
import { nameSpaceAbi } from "../abi/abi";
import { BaseWeb3Contract } from "./BaseWeb3Contract";

export class CNS extends BaseWeb3Contract{

    constructor(provider: ethers.Provider){
        super(provider, NAMESPACE_CONTRACT, nameSpaceAbi)
    }

public async getNamespaceCharacters(namespaceCid: BigInt): Promise<string> {
    try{
        const characters = await this.contract.getNamespaceCharacters(namespaceCid);
        return characters
    }catch(error){
        throw new Error(`Failed to get namespace characters. Error: ${error}`);
    }
}


}