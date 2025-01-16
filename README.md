# 🛒 Decentralized Marketplace DApp

A **decentralized application (DApp)** that allows users to create, buy, and transfer digital assets securely using Ethereum blockchain and IPFS. The project focuses on transparency, security, and ease of use, leveraging the latest Web3 technologies.

---

## 🚀 Features

- 🔗 **List Items for Sale**: Easily upload and list your digital assets.
- 💰 **Buy Items**: Purchase listed items using Ether.
- ✉️ **Transfer Ownership**: Transfer purchased items securely to others.
- 🌐 **IPFS Integration**: Decentralized storage using IPFS via Pinata.
- 🔄 **Real-Time Feedback**: Responsive UI with loading indicators for blockchain transactions.
- 🔐 **Blockchain Security**: Immutable and secure smart contract transactions.

---

## 🛠️ Tech Stack

- **Frontend**: [React.js](https://reactjs.org/), [Flowbite UI](https://flowbite.com/)
- **Smart Contracts**: [Solidity](https://soliditylang.org/)
- **Blockchain Interaction**: [Ethers.js](https://docs.ethers.io/)
- **Decentralized Storage**: [IPFS](https://ipfs.io/) via [Pinata](https://pinata.cloud/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **Wallet Integration**: [MetaMask](https://metamask.io/)

---

## 📋 Prerequisites

Before you begin, ensure you have the following:

- **Node.js** (v16 or higher): [Download](https://nodejs.org/)
- **MetaMask** Browser Extension: [Install](https://metamask.io/)
- **Ethereum Wallet with Testnet ETH**: Use [Goerli Faucet](https://goerlifaucet.com/) for test Ether.
- **Pinata Account**: [Sign up](https://pinata.cloud/)

---

## 🧑‍💻 Setup Guide

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```
### 2️⃣ Install Dependencies
```bash
npm install
```
### 3️⃣ Configure Environment Variables
Create a .env file in the project root:
```bash
REACT_APP_PINATA_API_KEY=your_pinata_api_key
REACT_APP_PINATA_SECRET_KEY=your_pinata_secret_key
REACT_APP_CONTRACT_ADDRESS=your_contract_address
```
### 4️⃣ Start the Development Server
```bash
npm start
```

## 📜 Usage Guide
### 🛍️ Listing Items for Sale
Navigate to the "Sell Item" page.
Fill in the details: item name, price, and upload the file.
Confirm the listing. The file will be uploaded to IPFS, and the data will be stored on the blockchain.
###  💵 Buying Items
Browse the marketplace to view available items.
Select an item and confirm the purchase using MetaMask.
###  🔄 Transferring Ownership
Open the "My Collection" page.
Enter the recipient's Ethereum address for the item you wish to transfer.
Confirm the transaction to transfer ownership.


# 📂 Project Structure
```bash
src/
├── components/
│   ├── ListItemForm.jsx       # Form to list items
│   ├── OwnedItemsGrid.jsx     # Displays owned items
│   ├── Marketplace.jsx        # Marketplace interface
├── utils/
│   ├── ipfs.js                # IPFS functions
│   ├── ethers.js              # Blockchain interaction
├── contracts/
│   └── Marketplace.sol        # Solidity smart contract
```
# 🎥 Demo

## FrontEnd UI
![mainpage](./public/load-animation-unscreen.gif)
![mainpage](./public/load-animation-unscreen.gif)

## 🔮 Future Enhancements
1.  🔍 Advanced Search and Filters: Enhance user experience with better item discovery.
2. 💡 Dynamic Pricing: Introduce dynamic pricing based on market trends.
3. 📦 Additional File Types: Expand support for diverse digital assets.
4. 🤝 Contributing  Contributions are welcome! Follow these steps:

## Fork the repository.
```bash
Create a new branch: git checkout -b feature/your-feature-name.
Commit your changes: git commit -m 'Add a new feature'.
Push to the branch: git push origin feature/your-feature-name.
Open a pull request.
```

# 📜 License
 This project is licensed under the MIT License.


## ⭐ Acknowledgments
* 🌟 Pinata for seamless IPFS integration. 
* 🌟 Ethers.js for blockchain interactions.
* 🌟 Flowbite and TailwindCSS for beautiful UI components.
