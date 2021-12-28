var ethers = require('ethers');
var abi = require('./abi.json')
var memjs = require('memjs')

const settings = {
    baseURI: "https://orbitsnft.art",
    // contractAddress: "0x03Ce4a39Dd1146d052934836f73E2d7f82ab5Bba",
    contractAddress: "0x290841bA121462F90EA527849Bd5302C50B6AFB5",
    infuraAPI: "https://mainnet.infura.io/v3/880a855aaa9d4e57b5a5e34e028f4fdf"
    // infuraAPI: "https://rinkeby.infura.io/v3/880a855aaa9d4e57b5a5e34e028f4fdf"
}

const provider = new ethers.providers.getDefaultProvider(settings.infuraAPI)
const contract = new ethers.Contract(settings.contractAddress, abi, provider)

var mc = memjs.Client.create(process.env.MEMCACHIER_SERVERS, {
    failover: true,  // default: false
    timeout: 1,      // default: 0.5 (seconds)
    keepAlive: true  // default: false
})

module.exports = {
    ...settings,
    contract,
    mc
}