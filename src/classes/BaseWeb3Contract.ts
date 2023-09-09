import { ethers } from "ethers";

export abstract class BaseWeb3Contract {
    protected provider: ethers.Provider;
    protected contract: ethers.Contract;

    constructor(provider: ethers.Provider, address: string, abi: any[]){
        this.provider = provider;
        this.contract = new ethers.Contract(address, abi, this.provider)
    }
}