import { Cip } from '../src/cip';
import { ethers } from 'ethers';
import { CID_NFT_CONTRACT, ADDRESS_REGISTRY_CONTRACT, ANSYBL_URL } from '../src/constants';


describe('Cip', () => {
    let mockProvider: ethers.Provider;
    let cipInstance: Cip;
    let testAddress: `0x${string}`;
    let testAddressCid: bigint
    // Create an instance of the Cip class before each test
    beforeEach(() => {
        mockProvider = new ethers.JsonRpcProvider(ANSYBL_URL)
        cipInstance = new Cip(mockProvider)
        testAddress = '0x035bC96201666333294C5A04395Bb3618a2b6A11'
        testAddressCid = 21n
    });

    it('should initialize with default addresses', () => {
        expect(cipInstance.addresses.cip).toBe(CID_NFT_CONTRACT);
        expect(cipInstance.addresses.addressRegistry).toBe(ADDRESS_REGISTRY_CONTRACT);
    });

    // it('should override default addresses', () => {
    //     const address_override = {
    //         cip: '0xCustomCipAddress',
    //         addressRegistry: '0xCustomRegistryAddress'
    //     };
    //     const cipInstance = new Cip(mockProvider, address_override);

    //     expect(cipInstance.addresses.cip).toBe(address_override.cip);
    //     expect(cipInstance.addresses.addressRegistry).toBe(address_override.addressRegistry);
    // });

    it('should get the CID for address', async () => {
        const cid = await cipInstance.getCid(testAddress)
        expect(cid).toEqual(testAddressCid)
    }, 10000)

    // it('should fetch primary data', async () => {
    //     const mockData = 'sampleData';

    //     const result = await cipInstance.getPrimaryData(testAddressCid, testAddress);

    //     expect(result).toBe(mockData);
    // }, 1000);

    // // ... Similarly, write tests for other methods ...

    // // Example for testing error scenario
    // it('should throw an error when fetching primary data fails', async () => {
    //     const mockCid = 'mockCid';
    //     const mockName = 'mockName';

    //     (ethers.Contract.prototype.getPrimaryData as jest.Mock).mockRejectedValueOnce(new Error('Some Ethereum error'));

    //     const cipInstance = new Cip(mockProvider);

    //     await expect(cipInstance.getPrimaryData(mockCid, mockName)).rejects.toThrow(`Failed to get primary data for CID ${mockCid} and name ${mockName}`);
    // });
});