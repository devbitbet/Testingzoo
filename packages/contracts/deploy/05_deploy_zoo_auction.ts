// deploy/05_deploy_zoo_auction.ts
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import { getDeployerAddress } from '../lib/deploy_helper'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, ethers, getNamedAccounts } = hre
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()

  const useProxy = !hre.network.live

  const tokenAddress = (await deployments.get('ZooToken')).address
  const mediaAddress = (await deployments.get('ZooMedia')).address

  // Proxy only in non-live network (localhost and hardhat network) enabling
  // HCR (Hot Contract Replacement) in live network, proxy is disabled and
  // constructor is invoked
  await deploy('ZooAuction', {
    from: deployer,
    args: [mediaAddress, tokenAddress],
    log: true,
    // proxy: useProxy && 'postUpgrade',
  })

  return !useProxy // When live network, record the script as executed to prevent rexecution
}

export default func
func.id = 'deploy_zoo_auction' // ID required to prevent reexecution
func.tags = ['ZooAuction']
func.dependencies = ['ZooMedia', 'ZooMarket']
