import { ethers } from "ethers";
import { NAMESPACE_CONTRACT } from "./constants";
import { nameSpaceAbi } from "./abi/abi";

export class Cns {
    provider: ethers.Provider;
    cns: ethers.Contract;
    address: string;

    constructor(provider: ethers.Provider){
        this.provider = provider
        this.address = NAMESPACE_CONTRACT
        this.cns = new ethers.Contract(
            this.address,
            nameSpaceAbi,
            this.provider
        )
    }

public async getNamespaceCharacters(namespaceCid: BigInt): Promise<string> {
    try{
        const characters = await this.cns.getNamespaceCharacters(namespaceCid);
        return characters
    }catch(error){
        throw new Error(`Failed to get namespace characters. Error: ${error}`);
    }
}


}