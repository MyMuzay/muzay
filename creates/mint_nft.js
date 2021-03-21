require('dotenv').config();
const API_URL = process.env.API_URL;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);

const contract = require("../artifacts/contracts/MuzayNFT.sol/MyNFT.json"); 
const contractAddress = "0x66d3fc74bf9faaa270a4f3b64d9e11b6d394d617";
const nftContract = new web3.eth.Contract(contract.abi, contractAddress);

const mintNFT = async (z, tokenURI, creatorAddress) => {
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest'); //get latest nonce
  
    //the transaction
    const tx = {
      'from': creatorAddress,
      'to': contractAddress,
      'nonce': nonce,
      'gas': 500000,
      'data': nftContract.methods.mintNFT(creatorAddress, tokenURI).encodeABI()
    };

    z.console.log('transaction: ', tx);
  
    const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
    
    return signPromise.then((signedTx) => {
      web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(err, hash) {
        if (!err) {
          console.log("The hash of your transaction is: ", hash, "\nCheck Alchemy's Mempool to view the status of your transaction!"); 
        } else {
          console.log("Something went wrong when submitting your transaction:", err)
        }
      });
    }).catch((err) => {
      console.log(" Promise failed:", err);
    });
  }



const perform = async (z, bundle) => {
  await mintNFT(z, `https://gateway.pinata.cloud/ipfs/${bundle.inputData.cid}`, bundle.inputData.user_address);
  return { message: 'You successfully minted an NFT!' };
};

module.exports = {
  key: 'mint_nft',
  noun: 'NFT',

  display: {
    label: 'Mint NFT',
    description: 'Mint NFT metadata.',
  },

  operation: {
    perform,
    inputFields: [
      {
        key: 'user_address',
        label: 'User Address',
        required: true,
        helpText: 'Rinkeby User Wallet Address (Creator)',
      },
      {
        key: 'cid',
        label: 'IPFS CID',
        required: true,
        helpText: 'IPFS CID to the NFT content from the Add Metadata Step',
      },
    ],
    sample: { test: 'test' },
  },
};
