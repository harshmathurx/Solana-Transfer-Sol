// Import Solana web3 functinalities
const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL,
    Transaction,
    SystemProgram,
    sendAndConfirmRawTransaction,
    sendAndConfirmTransaction
} = require("@solana/web3.js");
const base58 = require("bs58");


// Making a keypair and getting the private key
// const newPair = Keypair.generate();
// console.log(newPair);

const transferSol = async () => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    // Get Keypair from Secret Key
    const from = Keypair.fromSecretKey(
        base58.decode(
            "PASTE_YOUR_PRIVATE_KEY"
        )
    );

    const to = Keypair.generate();

    // Aidrop 2 SOL to Sender wallet
    console.log("Airdopping some SOL to Sender wallet!");
    const fromAirDropSignature = await connection.requestAirdrop(
        new PublicKey(from.publicKey),
        2 * LAMPORTS_PER_SOL
    );

    // Latest blockhash (unique identifer of the block) of the cluster
    let latestBlockHash = await connection.getLatestBlockhash();

    // Confirm transaction using the last valid block height (refers to its time)
    // to check for transaction expiration
    await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: fromAirDropSignature
    });

    console.log("Airdrop completed for the Sender account");

    // Send money from "from" wallet and into "to" wallet
    var transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: from.publicKey,
            toPubkey: to.publicKey,
            lamports: LAMPORTS_PER_SOL //1 SOL
        })
    );

    // Sign transaction
    var signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [from]
    );
    console.log('Signature is', signature);
}

transferSol();