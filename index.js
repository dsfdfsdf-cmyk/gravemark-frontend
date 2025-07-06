// ✅ 不再需要 import ethers，因为 ethers 已通过 <script> 标签全局注入

const contractAddress = "0xc0860c2620e388d78a8a74c04bf8d6ba0bbc86c6"; // ✅ 当前部署的合约地址

const abi = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "mintMonster",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "monsterId", "type": "uint256" }
    ],
    "name": "attack",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "name": "monsters",
    "outputs": [
      { "internalType": "uint8", "name": "status", "type": "uint8" },
      { "internalType": "address[]", "name": "attackers", "type": "address[]" },
      { "internalType": "address", "name": "creator", "type": "address" },
      { "internalType": "bool", "name": "exists", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

let provider;
let signer;
let contract;

async function connectWallet() {
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    contract = new ethers.Contract(contractAddress, abi, signer);
    document.getElementById("wallet-status").innerText = "Wallet Connected";
    console.log("Wallet connected");
  } else {
    alert("Please install MetaMask!");
  }
}

async function mintMonster() {
  try {
    const tx = await contract.mintMonster();
    await tx.wait();
    alert("Monster minted successfully!");
  } catch (err) {
    alert("Mint failed: " + err.message);
  }
}

async function attackMonster() {
  const id = document.getElementById("attack-id").value;
  try {
    const tx = await contract.attack(id);
    await tx.wait();
    alert("Attack complete!");
  } catch (err) {
    alert("Attack failed: " + err.message);
  }
}

async function checkMonsterStatus() {
  const id = document.getElementById("status-id").value;
  try {
    const data = await contract.monsters(id);
    alert(`Monster ${id}:
Exists: ${data.exists}
Status: ${data.status == 0 ? "Alive" : "Defeated"}
Creator: ${data.creator}`);
  } catch (err) {
    alert("Error fetching status: " + err.message);
  }
}

// 绑定按钮事件
document.getElementById("connect").onclick = connectWallet;
document.getElementById("mint").onclick = mintMonster;
document.getElementById("attack").onclick = attackMonster;
document.getElementById("check-status").onclick = checkMonsterStatus;
