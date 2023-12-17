        const contractAddress = "0xd9145CCE52D386f254917e481eB44e9943F39138";
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
                "name": "getLatestWinner",
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
                "name": "getLatestWinnerInfo",
                "outputs": [
                    {
                        "internalType": "address payable",
                        "name": "",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "index",
                        "type": "uint256"
                    }
                ],
                "name": "getPlayerByIndex",
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
                "inputs": [],
                "name": "getPlayers",
                "outputs": [
                    {
                        "internalType": "address[]",
                        "name": "",
                        "type": "address[]"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "getPlayersCount",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
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
                "name": "lotteryHistory",
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
                "name": "lotteryId",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
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
                "name": "players",
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
                "inputs": [],
                "name": "winner",
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
                "inputs": [],
                "name": "winnings",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
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
        try {
            if (typeof web3 !== "undefined") {
                web3 = new Web3(window.ethereum);
            } else {
                web3 = new Web3(window.ethereum);
            }
            accounts = await web3.eth.getAccounts();
            contract = new web3.eth.Contract(abi, contractAddress);

            document.getElementById('enterLottery').disabled = false;
            document.getElementById('pickWinner').disabled = false;

            console.log("Wallet connected");
            console.log("First 5 characters:", accounts[0].slice(0, 5));
            console.log("Last 5 characters:", accounts[0].slice(-5));
        } catch (error) {
            console.error("Error connecting to web3:", error);
        }
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
            updatePlayersList();
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
            updatePlayersList();
        } catch (error) {
            console.error("Error picking the winner:", error.message);
        }
    } else {
        console.error("Web3 not available. Please connect your wallet.");
    }
}

function updatePlayersList() {
    contract.methods.getPlayers().call()({ gas: 3000000 })
        .then(displayPlayers)
        .catch(error => console.error("Error updating players list:", error.message));
}

function displayWinner() {
    contract.methods.getWinnerInfo().call()
        .then(result => {
            const winnerAddress = result[0];
            const winnings = result[1];

            const winnerElement = document.getElementById('winner');
            winnerElement.innerHTML = `<p>Winner: ${winnerAddress}</p><p>Winnings: ${winnings} wei</p>`;
        })
        .catch(error => console.error("Error displaying winner:", error.message));
}

// New functions for displaying players
async function displayPlayers() {
    try {
        const count = await contract.methods.getPlayersCount().call();
        const playersElement = document.getElementById('players');
        playersElement.innerHTML = "<p>Players:</p>";

        for (let i = 0; i < count; i++) {
            const player = await contract.methods.getPlayerByIndex(i).call();
            playersElement.innerHTML += `<p>${player}</p>`;
        }
    } catch (error) {
        console.error("Error displaying players:", error.message);
    }
}

// New function for displaying the latest winner
async function displayLatestWinner() {
    try {
        const winner = await contract.methods.getLatestWinner().call();
        const winnerElement = document.getElementById('latestWinner');
        winnerElement.innerHTML = `<p>Latest Winner: ${winner}</p>`;
    } catch (error) {
        console.error("Error displaying latest winner:", error.message);
    }
}

initApp();
