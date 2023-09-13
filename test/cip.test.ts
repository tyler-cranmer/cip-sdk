import { CIP } from '../src/classes/cips2';
import { ethers } from 'ethers';
import { ANSYBL_URL} from '../src/constants';


describe('Cip', () => {
    let mockProvider: ethers.Provider;
    let cipInstance: CIP;
    let testAddress: `0x${string}`;
    let testAddressCid: BigInt;
    let testPfpCID: BigInt;
    let testBioCID: BigInt;
    let testNamespaceCID: BigInt;

    beforeEach(async () => {
        mockProvider = new ethers.JsonRpcProvider(ANSYBL_URL)
        cipInstance = new CIP(mockProvider)
        testAddress = '0x035bc96201666333294c5a04395bb3618a2b6a11'
        testAddressCid = 21n
        testPfpCID = 35n;
        testBioCID = 17n;
        testNamespaceCID = 122n;
    });


    it('should get the CID for address', async () => {
        const CID = await cipInstance.getCID(testAddress)
        expect(CID).toEqual(testAddressCid)
    }, 10000)


    it('should return primary data namespace',async () => {
  
        const data = await cipInstance.getPrimaryData(testAddressCid, 'namespace')
        expect(data).toEqual(122n)
    }, 10000 )

    it('should get namespace ID', async () => {

        const data = await cipInstance.getNamespaceCID(testAddressCid)
        expect(data).toEqual(122n);
    }, 10000)

    it('should return pfpCID', async ()=> {
    
        const data = await cipInstance.getPfpCID(testAddressCid);
        expect(data).toEqual(35n)
    }, 10000)

    it('should get BioCID', async () => {
     
        const data = await cipInstance.getBioCID(testAddressCid);

        expect(data).toEqual(17n);
    }, 10000);


    it('should get Namespace', async () => {
        const name_to_be_returned = {
            displayName: '0xt𝑒𝑒ɯ𝒽𝓎',
            baseName: '0xteewhy.canto'
        }

        const namespace = await cipInstance.getNamespace(testNamespaceCID)

        expect(namespace).toEqual(name_to_be_returned);
    },  10000);


    it('should get pfpData', async () => {
        const pfp_data_to_be_returned = ['0x1d20740CcEd2CaF15389d4Ed625d25C8Ac4e0272', 17n ]
        const pfpData = await cipInstance.getPfpData(testPfpCID);

        expect(pfpData).toEqual(pfp_data_to_be_returned)

    }, 10000);

    it('should return pfp Image data', async () => {
        const pfp_to_be_returned = {
            src: 'ipfs://QmfVfRh6Um2eg1gVuAzSgEDYmgcYGVKR1EVM45ZWkUN6KX/17.png',
            alt: 'CantoLanterns #17',
        }

        const nft_contract = '0x1d20740CcEd2CaF15389d4Ed625d25C8Ac4e0272'
        const nftID = 17n  
        const pfpData =  await cipInstance.getPfpImage(nft_contract, nftID);

        expect(pfpData).toEqual(pfp_to_be_returned)

    }, 10000 );

    it('should get bio', async () => {
        const bio = await cipInstance.getBio(testBioCID);
        expect(bio).toEqual('builder. coder. boarder.')
    }, 10000)

describe('CIP other functions', () => {
    let mockProvider: ethers.Provider;
    let cipInstance: CIP;
    let testAddress: `0x${string}`;

    beforeEach(async () => {
        mockProvider = new ethers.JsonRpcProvider(ANSYBL_URL)
        cipInstance = new CIP(mockProvider)
        testAddress = '0x035bc96201666333294c5a04395bb3618a2b6a11'
    });

    it('should get the bio by address', async () => {
        const bio = await cipInstance.getBioByAddress(testAddress)

        expect(bio).toEqual('builder. coder. boarder.')
    }, 10000)

    it('should get namespace by address', async () => {
        const name_to_be_returned = {
            displayName: '0xt𝑒𝑒ɯ𝒽𝓎',
            baseName: '0xteewhy.canto'
        }
        const ns = await cipInstance.getNamespaceByAddress(testAddress)
        expect(ns).toEqual(name_to_be_returned)
    }, 50000)

    it.only('should get pfp info', async () => {
        const pfp_to_be_returned = {
            src: 'ipfs://QmfVfRh6Um2eg1gVuAzSgEDYmgcYGVKR1EVM45ZWkUN6KX/17.png',
            alt: 'CantoLanterns #17',
        }
        const pfp = await cipInstance.getPfpByAddress(testAddress);
        expect(pfp).toEqual(pfp_to_be_returned);
    }, 50000)

})







    // it('should return return erron when an invalid address is given', async () => {
    //     const invalid_id = '0x035bC96201666333294C5A04395Bb3618a2b6A45';

    //     await expect(cipInstance.getCID(invalid_id)).rejects.toEqual({
    //         error: 'User with 3 not found.',
    //       });
    // }, 10000)

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