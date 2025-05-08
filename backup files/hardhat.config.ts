// import { HardhatUserConfig } from "hardhat/config";
// import "@nomicfoundation/hardhat-toolbox";

// const config: HardhatUserConfig = {
//   solidity: "0.8.28",
// };

// export default config;





import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ethers";
import "@typechain/hardhat";

// const config: HardhatUserConfig = {
//   solidity: "0.8.20",
//   networks: {
//     localhost: {
//       url: "http://127.0.0.1:8545",
//     },
//   },
//   // typechain: {
//   //   outDir: "typechain-types",
//   //   target: "ethers-v5",
//   // },
// };


module.exports = {
    solidity: "0.8.4",
    // other configurations
  };
  

// export default config;