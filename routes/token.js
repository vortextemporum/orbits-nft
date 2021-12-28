let express = require('express');
let router = express.Router();
// let {contract, baseURI} = require('../utils')
let {contract, baseURI, mc} = require('../utils')
let thumbnail = require('./lib/thumbnail')
let getAttributes = require('../public/javascripts/metadata')
/* GET home page. */
let isBusy;
// let hash;
router.get('/token/:id', async function (req, res, next) {
    try {
        let id = req.params.id
        // const supply = await contract.totalSupply()
        // console.log(id)
        // console.log(parseInt(supply))
        // console.log(parseInt(id) >= parseInt(supply))
        // if (id === null || typeof id == "undefined" || parseInt(id) >= parseInt(supply)) {
        if (id === null || typeof id == "undefined") {
            res.status(404).json({error: "error"})
            return
        }
        if (isBusy) {
            res.status(202)
            return
        }
        const cached = await mc.get(`token_${parseInt(id).toString()}`)
        console.log(cached)
        if (cached.value) {
            res.status(200).json(JSON.parse(cached.value?.toString()))
            isBusy = false;
            return
        }
        isBusy = true
        let hash;
        try {
            hash = await contract.tokenHash(id)
        }
        catch(err) {
            res.status(404).json({error: "error"})
            isBusy = false;
            return
        }
        // const hash = await contract.tokenHash(id)

        // console.log(hash)
        // console.log(typeof(hash))
        // if (!hash) {
        //     res.status(404).json({error: "error"})
        //     isBusy = false;
        //     return
        // }
        let [attributes, extraInformation] = getAttributes(hash)
        console.info('Creating Thumbnail')
        let image = await thumbnail(id)
        console.log(image)
        if (image) {
            image = `https://ipfs.infura.io/ipfs/${image}`
        }
        isBusy = false;
        let metadata$ = {
            image,
            hash,
            name: `ørß1t$ - #${id}`,
            description: `In 2019, I was heavily influenced by Alexai Shulgin's "Form Art", and one of my first generative visual works using p5.js was, orbiting html radio buttons on browser. The live sketch can be viewed at my website "https://berkozdemir.com/", and SuperRare (as radiOrbit #1 and #2). "ørß1t$” is the updated version, rewritten for on-chain generative art purposes; which displays a unique combination of varying object shapes, color palettes & distribution, orbit directions & speeds for every mint. You can click on canvas and move in x-axis to change the overall spinning speed. Love y’all, xoxo`,
            license: `YOUR ørß1t$, YOUR CALL. If you own an ørß1t$ NFT, you are fully permitted to do whatever you want with it (including both non-commercial/commercial uses). You can even do paid fortune telling with it lol.  Also, creative derivative works are highly encouraged.`,
            animation_url: `${baseURI}/generator/${id}`,
            token_uri: `${baseURI}/api/token/${id}`,
            external_url: `${baseURI}/generator/${id}`,
            script_type: "p5js",
            aspect_ratio: "1",
            attributes: attributes,
        }
        // for (const [key, value] of Object.entries(extraInformation)) {
        //     metadata$[key] = value;
        // }
        
        console.log({metadata$})


        // magical thing. heroku has a memory cache add-on. this way we can cache our responses and get a faster working api.
        await mc.set(`token_${id}`, JSON.stringify(metadata$)
            , {expires: 1200}, function (err, val) {
                if (err !== null) {
                    console.log('Error setting value: ' + err)
                    res.status(500).json(err)
                    isBusy = false;
                    return
                }
        })
        res.status(200).json(metadata$)
    } catch (e) {
        console.log(e)
        isBusy = false;
        res.status(404)
    }
});


module.exports = router;
