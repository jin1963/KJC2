let provider;

async function initWeb3() {
  provider = window.ethereum || window.bitkeep?.ethereum || window.okxwallet?.ethereum;

  if (!provider) {
    alert("⚠️ ไม่พบ Web3 provider\nกรุณาเปิดหน้านี้จากแอป MetaMask หรือ Bitget Wallet เท่านั้น");
    return;
  }

  web3 = new Web3(provider);
  token = new web3.eth.Contract(erc20ABI, tokenAddress);
  contract = new web3.eth.Contract(stakingABI, contractAddress);

  provider.on('accountsChanged', () => window.location.reload());
  provider.on('chainChanged', () => window.location.reload());

  document.getElementById("connectWallet").addEventListener("click", connectWallet);
  document.getElementById("stakeButton").addEventListener("click", stakeTokens);
}

async function connectWallet() {
  try {
    const accounts = await provider.request({ method: "eth_requestAccounts" });
    user = accounts[0];

    const currentChainId = await provider.request({ method: "eth_chainId" });
    if (parseInt(currentChainId, 16) !== 56) {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x38" }]
      });
    }

    document.getElementById("status").innerHTML = `✅ Connected:<br>${user}`;
    loadStakes();
  } catch (err) {
    console.error("Connection failed:", err);
    alert("❌ Wallet connection failed: " + err.message);
    document.getElementById("status").innerText = "❌ Connection failed.";
  }
}
