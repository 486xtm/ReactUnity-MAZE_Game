import { FC, useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import Connect2Unity from "./Connect2Unity";


type PhantomEvent = "disconnect" | "connect" | "accountChanged";

interface ConnectOpts {
    onlyIfTrusted: boolean;
}

interface PhantomProvider {
    connect: (opts?: Partial<ConnectOpts>) => Promise<{ publicKey: PublicKey }>;
    disconnect: ()=>Promise<void>;
    on: (event: PhantomEvent, callback: (args:any)=>void) => void;
    isPhantom: boolean;
}

type WindowWithSolana = Window & { 
    solana?: PhantomProvider;
}



const Connect2Phantom: FC = () => {

    const [ walletAvail, setWalletAvail ] = useState(false);
    const [ provider, setProvider ] = useState<PhantomProvider | null>(null);
    const [ connected, setConnected ] = useState(false);
    const [ pubKey, setPubKey ] = useState<PublicKey | null>(null);


    const [userName, setUserName] = useState('');

    useEffect( ()=>{
        if ("solana" in window) {
            const solWindow = window as WindowWithSolana;
            if (solWindow?.solana?.isPhantom) {
                setProvider(solWindow.solana);
                setWalletAvail(true);
                // Attemp an eager connection
                solWindow.solana.connect({ onlyIfTrusted: true });
            }
        }
    }, []);

    const handleSubmit = async () => {
        let result = await fetch(
        'http://localhost:5000/register', {
            method: "post",
            body: JSON.stringify({ userName, pubKey }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        result = await result.json();
        console.warn(result);
        if (result) {
            alert("Data saved succesfully");
            setUserName("");
        }
    }

    useEffect( () => {
        provider?.on("connect", (publicKey: PublicKey)=>{ 
            console.log(`connect event: ${publicKey}`);
            setConnected(true); 
            setPubKey(publicKey);
            // handleSubmit();
        });
        provider?.on("disconnect", ()=>{ 
            console.log("disconnect event");
            setConnected(false); 
            setPubKey(null);
        });

    }, [provider]);

    useEffect( () => {
        console.log(userName, pubKey?.toBase58());
        if(pubKey !== null) {
            handleSubmit();
        }
    }, [pubKey])



    const connectHandler: React.MouseEventHandler<HTMLButtonElement> = () => {
        console.log(`connect handler`);
        provider?.connect()
        .catch((err) => { console.error("connect ERROR:", err); });
    }

    // const disconnectHandler: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    //     console.log("disconnect handler");
    //     setUserName('');
    //     setPubKey(null);
    //     provider?.disconnect()
    //     .catch((err) => {console.error("disconnect ERROR:", err); });
    // }

    return (
        <div>
            { walletAvail ?
                <>
                { connected ? 
                    <>
                        <p>Your public key is : {pubKey?.toBase58()}</p>
                        {/* <button onClick={disconnectHandler}>Disconnect from Phantom</button> */}
                        <Connect2Unity />
                    </>: 
                    <>
                        <h3>Please input your name</h3>
                        <input 
                            style={{height:'30px', marginBottom:'30px'}}
                            type="name"
                            onChange={({ target: { value } }) => {setUserName(value);}}
                            value={userName}
                            placeholder="Input your name"
                        />
                        <button style={{display:'flex', width:'100%'}} disabled={userName ? false : true} onClick={connectHandler}>Login with Phantom Wallet</button>
                    </>
                }
                
                </>
            :
                <>
                <p>Opps!!! Phantom is not available. Go get it <a href="https://phantom.app/">https://phantom.app/</a>.</p>
                </>
            }
        </div>
    );
}

export default Connect2Phantom;