const settings = {}

// these are global variables that we will use.
let provider
let providerRw
let contract
let contractRW
let signer
let contractAddress = "0xCD336e924203DBaEFECF49C527b32f3b318C36A1"
let baseURI = "https://orbitsnft.herokuapp.com/"
let infuraAPI = "https://rinkeby.infura.io/v3/880a855aaa9d4e57b5a5e34e028f4fdf"
let SUPPLY
let SALE_COUNT
let MAX_FREE_COUNT
let price = 0.0777

// i decided to used jquery(a javascript library) for this app because
$(document).ready(async function () {
    console.log("ready!");
    if (window.ethereum) {
        try {
            // await window.ethereum.enable()
            await window.ethereum?.send('eth_requestAccounts');
        } catch (e) {
            alert(e.message || e)
        } finally {
            provider = await new ethers.providers.getDefaultProvider(infuraAPI)
            providerRw = await new ethers.providers.Web3Provider(web3.currentProvider)
            console.log(provider,providerRw)
            contract = await new ethers.Contract(contractAddress, ContractABI, provider)
            contractRW = await new ethers.Contract(contractAddress, ContractABI, providerRw.getSigner())
            $('#mintButton').click(() => {
                mint()
            })
            $('#claimButton').click(() => {
                freeClaim()
            })
            await fetchSupplyAndPrice();
        }
    }

});

async function fetchSupplyAndPrice() {
    try {
        SUPPLY = await contract.totalSupply()
        SALE_COUNT = await contract.SALE_COUNT()
        MAX_FREE_COUNT = await contract.FREE_MINT_COUNT()
        $('div.loader').remove()
        $('p#current-supply').text(`#${SUPPLY}/1024 total minted`)
        $('p#sale-count').text(`#${SALE_COUNT}/814 sold`)
        $('p#claim-count').text(`#${MAX_FREE_COUNT}/200 free claimed`)
        return true
    } catch (e) {
        console.log(e)
    } finally {
        console.log('loaded.')
    }
}

async function freeClaim() {

    // if(parseInt(providerRw.provider.chainId) !== 1) {
    if(parseInt(providerRw.provider.chainId) !== 4) {
        // always make sure you are on the right chain. so users don't lose any money.
        alert('WRONG NETWORK. WE ARE ON MAINNET ETHEREUM')
        return
    }
    let supply = await contractRW.FREE_MINT_COUNT()

    if(supply > 199) {

        alert('FREE CLAIM HAS ENDED :(')
        return
    }

    const tx = await contractRW.freeOrbitForBastard()
    const receipt = await tx.wait()
    if (receipt.confirmations >= 1) {
        alert('NFTs minted!')
    }

}

async function mint() {

    if(parseInt(providerRw.provider.chainId) !== 4) {
    // if(parseInt(providerRw.provider.chainId) !== 1) {
        // always make sure you are on the right chain. so users don't lose any money.
        alert('WRONG NETWORK. WE ARE ON MAINNET ETHEREUM')
        return
    }
    let supply = await contractRW.SALE_COUNT()

    if(supply > 813) {
        alert('SALE HAS ENDED. THANKS FOR ALL THE LOVE AND SUPPORT!')
        return
    }

    let value = ethers.utils.parseEther((price).toString())
    console.log({value, a: value.toString()})
    const tx = await contractRW.mintToken({value: value})
    const receipt = await tx.wait()
    if (receipt.confirmations >= 1) {
        alert('NFTs minted!')
    }

}