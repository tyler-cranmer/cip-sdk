import { ethers } from "ethers";
import { BaseWeb3Contract } from "./BaseWeb3Contract";
import { CID_NFT_CONTRACT } from "../constants";
import { cidNftAbi } from "../abi/abi";

export class CID extends BaseWeb3Contract {
    constructor(provider: ethers.Provider){
        super(provider, CID_NFT_CONTRACT, cidNftAbi )
    }
    /**
     * 
     * @param cidNFTID ID of the CID NFT to query.
     * @param subprotocolName Sub protocol name to query. This is the current list of accepted subprotocal names:
     * [namespace, profilepicture, bio]
     * @returns subprotocolNFTID the ID of the primary NFT at the queried subprotocol / CID NFT. returns 0 if it does not exist
     */
    public async getPrimaryData(cidNFTID: BigInt, subprotocolName: string): Promise<BigInt>{
        try {
            const result = await this.contract.getPrimaryData(cidNFTID, subprotocolName)
            return result
        } catch (error) {
            throw new Error (`Failed to get primary data characters. Error ${error}`)
        }
    }

}