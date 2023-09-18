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

const provider = new ethers.JsonRpcProvider('CANTO RPC URL');
const cipInstance = new CIP(provider);

const namespace = await cipInstance.getNamespaceByAddress('USER ADDRESS')
const bio = await cipInstance.getBioByAddress('USER ADDRESS')
const pfp = await cipInstance.getPfpByAddress('USER ADDRESS');

```

## Methods

- getCID(address): returns the CIP NFT ID of the provided address.
- getPrimaryData(cid, subprotocolName): Method is used to get the users NFT IDs of any subprotocol registered with the user's CID.
- getNamespaceCID(cid): Method used to get the users registered namespace CID.
- getBioCID(cid): Method used to get the user's registered bio CID.
- getPfpCID(cid): Method used to get the user's registered pfp CID.
- getNamespace(namespaceCID): Method used to return te user's registered namespace display name and base name.
- getPfpData(pfpCID): Method used to get the user's profile picture data from profile picture contract. Profile picture data = [nftContractAddress, nftID]
- getPfpImage(nftContractAddress, nftID): Method used to get the user's pfp image data. return value will be src = image src, alt: nft name.
- getBio(bioCID): Method used to get user's bio information. return value is a string of the registered bio.
- getBioByAddress(address): Method is an aggregation of getCID, getBioCID and getBio. This method only needs user's address to return the bio.
- getNamespaceByAddress(address): Method used to get user's namespace data. This method is also an aggregation of getCID, getNamespaceCID, and getNamespace. 
- getPfpByAddress(address): Method used to get the user's profile picture data. This method is also an aggregation of getCID, getPfpData, getPfpImage. return value will be src = image src, alt: nft name.

