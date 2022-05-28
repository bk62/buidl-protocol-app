import { NFTStorage, File } from "nft.storage"
import fs from "fs";
import path from "path";
import mime from "mime";
import { supabase } from "../../utils/supabaseClient";
import { dataAttr } from "@chakra-ui/utils";


const BUCKET_NAME = "avatars";
const nftStorageKey = process.env.NFT_STORAGE_API_KEY || ""
const DEFAULT_FILE = "public/defaultimages/small/0.jpg"; // TODO randomise
const SIMULATE_NFT_STORAGE = process.env.SIMULATE_NFT_STORAGE && process.env.SIMULATE_NFT_STORAGE?.toLowerCase() == "true"

export default async function handler(req, res) {
    const body = req.body
    console.log('body: ', body)
    console.log("simulate storage is", SIMULATE_NFT_STORAGE)
    // console.log("Default file")
    // console.log(await fileFromPath(DEFAULT_FILE))
    const { name, description, image, handle, tags } = body;

    if (SIMULATE_NFT_STORAGE) {
        // ---- Debugging: ----
        res.json({
            ipnft: 'bafyreidx5ebyejvprjdyo6q2mhar7o4f26im3634u22jwmxaakbnx7m6se',
            url: 'ipfs://bafyreidx5ebyejvprjdyo6q2mhar7o4f26im3634u22jwmxaakbnx7m6se/metadata.json'
        })
    } else {
        // ---- Production -----
        const token = await storeNFT(image, name, description, tags, `${handle}-profile-image`);
        res.json(token)

        // ----- Simulate error ----
        // res.json({ ...token, error: { message: 'Something went wrong...' } });
    }


}



async function storeNFT(imageFilename, name, description, tags, filename = "") {
    const image = await fileFromStorage(imageFilename, filename = filename);
    // return {
    //     name,
    //     description,
    //     image
    // }
    const nftStorage = new NFTStorage({ token: nftStorageKey })
    return nftStorage.store({
        image,
        name,
        description,
        tags
    });
}


async function fileFromStorage(imageFilename, filename = "") {
    if (imageFilename == "") {
        return fileFromPath(DEFAULT_FILE, filename);
    }
    const { data, error } = await supabase.storage.from(BUCKET_NAME).download(imageFilename);
    // TODO if error use default image file
    // const defaultFile = await getDefaultFile()
    // const imageFile = error ? defaultFile : data;
    if (error) {
        return fileFromPath(DEFAULT_FILE, filename);
    }
    const imageBlob = data || new Blob();
    console.log("Got back from supabase, blob is empty?", imageBlob.size === 0)

    // Debug - write to file
    // fs.writeFile('test.png', Buffer.from(await imageBlob.arrayBuffer()), (err) => {
    //     console.log(err)
    // })

    // TODO
    // assuming extension is actual type!!
    const ext = imageFilename.split('.').at(-1)
    const type = { type: mime.getType(ext) }
    const fn = (filename || imageFilename) + "." + ext
    // Blob to Buffer
    const imageFile = Buffer.from(await imageBlob.arrayBuffer());

    return new File([imageFile], fn, type);

}


async function fileFromPath(filePath, filename = "") {
    const content = await fs.promises.readFile(filePath);
    const type = mime.getType(filePath);
    const fn = filename || path.basename(filePath);
    return new File([content], fn, { type });
}