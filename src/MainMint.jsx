import "./styles/MainMint.scss";

import { useState } from "react";
import { ethers, BigNumber } from "ethers";
import roboPunksNFT from "./RoboPunksNFT.json";

const roboPunksNFTAddress = "0x1605B1e876Da488b33F4dD398a3C946089A05Eaf";

export default function MainMint({ accounts, setAccounts }) {

    const [mintAmount, setMintAmount] = useState(1);
    const isConnected = Boolean(accounts[0]);

    async function handleMint() {
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(roboPunksNFTAddress, roboPunksNFT.abi, signer);

            try {
                const response = await contract.mint(BigNumber.from(mintAmount), {
                    value: ethers.utils.parseEther((0.02 * mintAmount).toString())
                });
                console.log(`Response: ${response}`);
            } catch(err) {
                console.error(`Error: ${err}`);
            }
        }
    }

    function handleDecrement() {
        if (mintAmount <= 1) return;
        setMintAmount(mintAmount - 1);
    }

    function handleIncrement() {
        if (mintAmount >= 3) return;
        setMintAmount(mintAmount + 1);
    }

    return (
        <section className="mainMint">
            <h1>RoboPunks</h1>
            <p>
                It's 2078. Can the RoboPunks NFT save humans from destructive rampant NFT speculations? Mint RoboPunks to find out.
            </p>
            {
                isConnected ? (
                    <div>
                        <div className="inputContainer">
                            <button onClick={handleDecrement}>-</button>
                            <input type="number" value={mintAmount} readOnly />
                            <button onClick={handleIncrement}>+</button>
                        </div>
                        <button onClick={handleMint}>Mint Now!</button>
                    </div>
                ) : (
                    <p>You must be connected to mint</p>
                )
            }
        </section>
    );
}