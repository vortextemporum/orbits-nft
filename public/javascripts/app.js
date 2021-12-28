const settings = {}

// these are global variables that we will use.
let provider;
let providerRw;
let contract;
let contractRW;
let signer;
// let contractAddress = "0xADA3Dc9F454FBfC7e248F2988c38974b8FF96833";
let contractAddress = "0x290841bA121462F90EA527849Bd5302C50B6AFB5";
// let SOSAddress = "0x4d73E2dc80a985a19bbc160ff1Bd2b7DeA65c880";
let SOSAddress = "0x3b484b82567a09e2588A13D54D032153f0c0aEe0";
let baseURI = "https://orbitsnft.art/";
// let infuraAPI = "https://rinkeby.infura.io/v3/880a855aaa9d4e57b5a5e34e028f4fdf";
let infuraAPI = "https://mainnet.infura.io/v3/880a855aaa9d4e57b5a5e34e028f4fdf";
let SUPPLY;
let SALE_COUNT;
let MAX_FREE_COUNT;
let DID_BASTARD_CLAIM;
let approvedSOS;
let price = 0.0777;
let walletAddress;

// i decided to used jquery(a javascript library) for this app because
$(document).ready(async function () {
    console.log("ready!");
    $('div#loadingSection').show();
    $('div#mintSection').hide();
    $('p#saleEnded').hide();

    if (window.ethereum) {
        try {
            // await window.ethereum.enable()
            await window.ethereum?.send('eth_requestAccounts');
        } catch (e) {
            alert("NO METAMASK DETECTED")
            // alert(e.message || e)
        } finally {
            provider = await new ethers.providers.getDefaultProvider(infuraAPI)
            providerRw = await new ethers.providers.Web3Provider(web3.currentProvider)

            if(parseInt(providerRw.provider.chainId) !== 1) {
                // always make sure you are on the right chain. so users don't lose any money.
                alert('WRONG NETWORK. WE ARE ON MAINNET ETHEREUM')
                return
            }

            console.log(provider,providerRw)
            contract = await new ethers.Contract(contractAddress, ContractABI, provider)
            contractRW = await new ethers.Contract(contractAddress, ContractABI, providerRw.getSigner())
            contractSOS = await new ethers.Contract(SOSAddress, SOSABI, providerRw.getSigner())

            walletAddress = await providerRw.getSigner().getAddress()

            console.log(walletAddress)
            approvedSOS = await contractSOS.allowance(walletAddress, contractAddress)

            $('#mintButton').click(() => {
                mint()
            })
            $('#approveSOSButton').click(() => {
                approveSOS(1)
            })
            $('#approveSOSButtonUnlimited').click(() => {
                approveSOS(0)
            })
            $('#revokeSOSButton').click(() => {
                revokeSOS()
            })
            $('#mintSOSButton').click(() => {
                mintOrbitWithSOS()
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
        DID_BASTARD_CLAIM = await contract.didWalletFreeClaim(walletAddress)
        // console.log(DID_BASTARD_CLAIM)
        // $('div.loader').remove()

        $('div#loadingSection').hide();

        if (parseInt(SUPPLY) === 1024) {

            $('p#saleEnded').show()

        } else {

            $('p#current-supply').text(`#${SUPPLY}/1024 total minted`)
            $('p#sale-count').text(`#${SALE_COUNT}/815 minted with ETH or SOS`)
            $('p#claim-count').text(`#${MAX_FREE_COUNT}/200 free claimed`)
            
            $('p#your-wallet').text(`Your Wallet  -  ${walletAddress}`)
            $('p#sos-approval').text(`Wallet $SOS approval  -  ${approvedSOS / (10 ** 18)}`)
    
            $('div#mintSection').show();
    
    
            if(DID_BASTARD_CLAIM === false) {
                $('button#claimButton').show()
                $('p#bastard-claim').hide()
            } else if (DID_BASTARD_CLAIM === true) {
                $('button#claimButton').hide()
                $('p#bastard-claim').text(`You already claimed your free ørß1t$ with your wallet.`)
            }
            
            if (approvedSOS < 42069420694206942069420690) {
    
                $('button#revokeSOSButton').hide()    
                $('button#mintSOSButton').hide()
                
            } else {
    
                $('button#approveSOSButton').hide()
                $('button#approveSOSButtonUnlimited').hide()
                
            }

        }


        

        // $('p#claim-count').prop('disabled', true);
        // $('p#claim-count').prop('disabled', true);

        return true
    } catch (e) {
        console.log(e)
    } finally {
        console.log('loaded.')
    }
}

async function freeClaim() {

    if(parseInt(providerRw.provider.chainId) !== 1) {
    // if(parseInt(providerRw.provider.chainId) !== 4) {
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

    // if(parseInt(providerRw.provider.chainId) !== 4) {
    if(parseInt(providerRw.provider.chainId) !== 1) {
        // always make sure you are on the right chain. so users don't lose any money.
        alert('WRONG NETWORK. WE ARE ON MAINNET ETHEREUM')
        return
    }
    let salecount = await contractRW.SALE_COUNT()

    if(salecount >= 815) {
        alert('SALE HAS ENDED. THANKS FOR ALL THE LOVE AND SUPPORT!')
        return
    }

    let value = ethers.utils.parseEther((price).toString())
    console.log({value, a: value.toString()})
    const tx = await contractRW.mintOrbit({value: value})
    const receipt = await tx.wait()
    if (receipt.confirmations >= 1) {
        alert('NFTs minted!')
    }

}
async function mintOrbitWithSOS() {

    // if(parseInt(providerRw.provider.chainId) !== 4) {
    if(parseInt(providerRw.provider.chainId) !== 1) {
        // always make sure you are on the right chain. so users don't lose any money.
        alert('WRONG NETWORK. WE ARE ON MAINNET ETHEREUM')
        return
    }
    let supply = await contractRW.SALE_COUNT()

    if(supply >= 815) {
        alert('SALE HAS ENDED. THANKS FOR ALL THE LOVE AND SUPPORT!')
        return
    }
    const tx = await contractRW.mintOrbitWithSOS()
    const receipt = await tx.wait()
    if (receipt.confirmations >= 1) {
        alert('NFTs minted!')
    }

}
async function approveSOS(option) {

    // if(parseInt(providerRw.provider.chainId) !== 4) {
    if(parseInt(providerRw.provider.chainId) !== 1) {
        // always make sure you are on the right chain. so users don't lose any money.
        alert('WRONG NETWORK. WE ARE ON MAINNET ETHEREUM')
        return
    }
    let approve_amount;
    if(option === 0) {
        approve_amount = '115792089237316195423570985008687907853269984665640564039457584007913129639935'; //(2^256 - 1 )
    } else if (option === 1) {
        approve_amount = '42069420694206942069420690'
    }

    const tx = await contractSOS.approve(contractAddress,approve_amount);
    const receipt = await tx.wait()
    if (receipt.confirmations >= 1) {
        alert('You approved SOS!')
    }

}
async function revokeSOS() {

    // if(parseInt(providerRw.provider.chainId) !== 4) {
    if(parseInt(providerRw.provider.chainId) !== 1) {
        // always make sure you are on the right chain. so users don't lose any money.
        alert('WRONG NETWORK. WE ARE ON MAINNET ETHEREUM')
        return
    }
    let approve_amount = '0';

    const tx = await contractSOS.approve(contractAddress,approve_amount);
    const receipt = await tx.wait()
    if (receipt.confirmations >= 1) {
        alert('You revoked your SOS approval to contract!')
    }

}