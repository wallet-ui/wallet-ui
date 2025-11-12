import { IdentifierString } from '@wallet-standard/core'

export interface Network {
  active?: boolean
  cluster: NetworkCluster
  endpoint: string
  id: IdentifierString
  name: string
}

export enum NetworkCluster {
  Mainnet = 'mainnet-beta',
  Testnet = 'testnet',
  Devnet = 'devnet',
  Custom = 'custom',
}
