// Currently stored in constants , later updraded to some other database
import {
    allowedAddressList,
    usernameBlackList,
  } from '@/src/constants/owlearnId'
  import { ethers } from 'ethers'
  import keccak256 from 'keccak256'
  import { MerkleTree } from 'merkletreejs'
  
  export const prepareAllowListMerkleRoot = async (): Promise<
    string | undefined
  > => {
    try {
      const abiCoder = new ethers.utils.AbiCoder()
  
      const encodedAddressList: any[] = []
      // prepare the encoded list
      await allowedAddressList.forEach(async (address) => {
        encodedAddressList.push(await abiCoder.encode(['address'], [address]))
      })
  
      console.log('Preparing the merkle tree ...')
  
      // prepare the MerkleTree
      const merkleTree: MerkleTree = new MerkleTree(
        encodedAddressList,
        keccak256,
        {
          hashLeaves: true, // Hash each leaf using keccak256 to make them fixed-size
          sortPairs: true, // Sort the tree for determinstic output
          sortLeaves: true,
        }
      )
  
      // compute the root
      const merkleRoot: string = merkleTree.getHexRoot()
      console.log('Merkle Root for the addressAllowList')
      console.log(merkleRoot)
  
      return merkleRoot
    } catch (error) {
      console.log(error)
    }
  }
  
  export const prepareAllowListMerkleProof = async (
    address: 0x${string}
  ): Promise<string[] | undefined> => {
    try {
      const abiCoder = new ethers.utils.AbiCoder()
      const encodedAddressList: any[] = []
      // prepare the encoded list
      await allowedAddressList.forEach(async (address) => {
        encodedAddressList.push(await abiCoder.encode(['address'], [address]))
      })
  
      // console.log(encodedAddressList);
  
      console.log('Preparing Merkle Tree ....')
      // prepare the MerkleTree
      const merkleTree: MerkleTree = new MerkleTree(
        encodedAddressList,
        keccak256,
        {
          hashLeaves: true, // Hash each leaf using keccak256 to make them fixed-size
          sortPairs: true, // Sort the tree for determinstic output
          sortLeaves: true,
        }
      )
  
      console.log('Preparing leaf and MerkleProof')
      const leaf = keccak256(await abiCoder.encode(['address'], [address]))
      const proof: string[] = await merkleTree.getHexProof(leaf)
      console.log(proof)
      return proof
    } catch (error) {
      console.log(error)
    }
  }
  
  export const prepareBlackListMerkleRoot = async (): Promise<
    string | undefined
  > => {
    try {
      const abiCoder = new ethers.utils.AbiCoder()
  
      const encodedUsernameList: any[] = []
      // prepare the encoded list
      await usernameBlackList.forEach(async (username) => {
        encodedUsernameList.push(await abiCoder.encode(['string'], [username]))
      })
  
      console.log('Preparing the merkle tree ...')
  
      // prepare the MerkleTree
      const merkleTree: MerkleTree = new MerkleTree(
        encodedUsernameList,
        keccak256,
        {
          hashLeaves: true, // Hash each leaf using keccak256 to make them fixed-size
          sortPairs: true, // Sort the tree for determinstic output
          sortLeaves: true,
        }
      )
  
      // compute the root
      const merkleRoot: string = merkleTree.getHexRoot()
      console.log('Merkle Root for the UserName Blacklist')
      console.log(merkleRoot)
  
      return merkleRoot
    } catch (error) {
      console.log(error)
    }
  }
  
  export const prepareBlackListMerkleProof = async (
    username: string
  ): Promise<string[] | undefined> => {
    try {
      const abiCoder = new ethers.utils.AbiCoder()
  
      const encodedUsernameList: any[] = []
      // prepare the encoded list
      await usernameBlackList.forEach(async (username) => {
        encodedUsernameList.push(await abiCoder.encode(['string'], [username]))
      })
  
      // console.log(encodedAddressList);
  
      console.log('Preparing Merkle Tree ....')
      // prepare the MerkleTree
      const merkleTree: MerkleTree = new MerkleTree(
        encodedUsernameList,
        keccak256,
        {
          hashLeaves: true, // Hash each leaf using keccak256 to make them fixed-size
          sortPairs: true, // Sort the tree for determinstic output
          sortLeaves: true,
        }
      )
  
      console.log('Preparing leaf and MerkleProof')
      const leaf = keccak256(await abiCoder.encode(['string'], [username]))
      const proof: string[] = await merkleTree.getHexProof(leaf)
      console.log(proof)
      return proof
    } catch (error) {
      console.log(error)
    }
  }