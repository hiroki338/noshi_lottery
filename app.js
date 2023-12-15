        const contractAddress = "0xD6C05318010D8d4c9d3EA06a3bDEB14A08327072";
        const abi = [
            {
                "inputs": [],
                "name": "enter",
                "outputs": [],
                "stateMutability": "payable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "pickWinner",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "inputs": [],
                "name": "getLastWinner",
                "outputs": [
                    {
                        "internalType": "address payable",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "getParticipants",
                "outputs": [
                    {
                        "internalType": "address payable[]",
                        "name": "",
                        "type": "address[]"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "lastWinner",
                "outputs": [
                    {
                        "internalType": "address payable",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "manager",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "name": "participants",
                "outputs": [
                    {
                        "internalType": "address payable",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            }
        ];

        let web3;
        let accounts;
        let contract;
        
        async function initApp() {
            if (typeof window.ethereum !== 'undefined') {
                web3 = new Web3(window.ethereum);
                accounts = await web3.eth.getAccounts();
                contract = new web3.eth.Contract(abi, contractAddress);

                console.log("Wallet connected");
                console.log("First 5 characters:", accounts[0].slice(0, 5));
                console.log("Last 5 characters:", accounts[0].slice(-5));
    } else {
        console.error("Web3 not available. Please install MetaMask or another Ethereum provider.");
    }
}

async function connect() {
    await initApp();
    if (accounts && accounts.length > 0) {
        const truncatedAddress = `${accounts[0].slice(0, 5)}...${accounts[0].slice(-5)}`;
        document.getElementById("connectWallet").innerText = `Connected (${truncatedAddress})`;
        document.getElementById("connectWallet").disabled = true;
    }
}

async function enterLottery() {
    await initApp();
    if (web3 && accounts && accounts.length > 0) {
        try {
            await contract.methods.enter().send({ from: accounts[0], value: web3.utils.toWei("0.01", "ether") });
            console.log("Entered the lottery!");
            updateParticipantsList();
        } catch (error) {
            console.error("Error entering the lottery:", error.message);
        }
    } else {
        console.error("Web3 not available. or accounts not initialized.");
    }
}

async function pickWinner() {
    if (web3 && accounts && accounts.length > 0) {
        try {
            await contract.methods.pickWinner().send({ from: accounts[0] });
            console.log("Winner picked!");
            displayWinner();
            updateParticipantsList();
        } catch (error) {
            console.error("Error picking the winner:", error.message);
        }
    } else {
        console.error("Web3 not available. Please connect your wallet.");
    }
}

function updateParticipantsList() {
    contract.methods.getParticipants().call()
        .then(displayParticipants)
        .catch(error => console.error("Error updating participants list:", error.message));
}

function displayWinner() {
    contract.methods.Lottery.getLastWinner().call()
        .then(winner => {
            const winnerElement = document.getElementById('winner');
            winnerElement.innerHTML = `<p>Winner: ${winner}</p>`;
        })
        .catch(error => console.error("Error displaying winner:", error.message));
}

function displayParticipants(participants) {
    const participantsList = document.getElementById('participantsList');
    participantsList.innerHTML = participants.map(address => `<li>${address}</li>`).join('');
}

initApp();
