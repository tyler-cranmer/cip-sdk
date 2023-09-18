# Canto Identity Protocol SDK (CIP-SDK)

The Canto Identity Protocol SDK provides easy use functions to retrieving user CIP data.

## Install

```bash
npm i cip-sdk
```

## Example

```typescript
import { ethers } from 'ethers';
import { CIP } from 'cip-sdk';

// Initialize provider and CIP instance
const provider = new ethers.JsonRpcProvider('<YOUR_CANTO_RPC_URL>');
const cipInstance = new CIP(provider);

// Retrieve user data using CIP
const namespace = await cipInstance.getNamespaceByAddress('<USER_CANTO_ADDRESS>');
const bio = await cipInstance.getBioByAddress('<USER_CANTO_ADDRESS>');
const pfp = await cipInstance.getPfpByAddress('<USER_CANTO_ADDRESS>');


```

## Methods

- getCID(address): CID - returns the CIP NFT ID of the provided address.
- getPrimaryData(cid, subprotocolName): sub protocol CID - Method is used to get the users NFT IDs of any subprotocol registered with the user's CID.
- getNamespaceCID(cid): namespace CID - Method used to get the users registered namespace CID.
- getBioCID(cid): bio CID - Method used to get the user's registered bio CID.
- getPfpCID(cid): pfp CID - Method used to get the user's registered pfp CID.
- getNamespace(namespaceCID): Namespace - Method used to return te user's registered namespace display name and base name.
- getPfpData(pfpCID): ProfilePictureData - Method used to get the user's profile picture data from profile picture contract. Profile picture data = [nftContractAddress, nftID]
- getPfpImage(nftContractAddress, nftID): ProfilePictureInfo - Method used to get the user's pfp image data. return value will be src = image src, alt: nft name.
- getBio(bioCID): bio - Method used to get user's bio information. return value is a string of the registered bio.
- getBioByAddress(address): bio - Method is an aggregation of getCID, getBioCID and getBio. This method only needs user's address to return the bio.
- getNamespaceByAddress(address): Namespace - Method used to get user's namespace data. This method is also an aggregation of getCID, getNamespaceCID, and getNamespace. 
- getPfpByAddress(address): ProfilePictureInfo - Method used to get the user's profile picture data. This method is also an aggregation of getCID, getPfpData, getPfpImage. return value will be src = image src, alt: nft name.

