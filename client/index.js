//instance = await BubbleFishContract.deployed()
//This is to check if broser is running metamask
console.log("MetaMask is installed? " + window.ethereum.isMetaMask);
//ethereum.networkVersion
//ethereum.selectedAddress

// function connectToMetamask(){
//   const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
//   const account = accounts[0];
// }

const web3 = new Web3(Web3.givenProvider);

window.ethereum.on("chainChanged", function (networkId) {
  console.log("networkChanged", networkId);
});
let instances = { bubbleFish: "", marketplace: "" };
let user;
const addresses = {
  bubbleFish: "0xE04560edf185f73cAa0545109254cEe2169DcFC5",
  marketplace: "0xA51C4f5dcF355C2A92f9d187c311F8ADA54FC95c",
};

let birthEventLatestBlock = -1;
let marketEventLatestBlock = -1;
let approvalForAllLatestBlock = -1;
$(document).ready(async () => {
  if (window.ethereum) {
    const x = await web3.eth.net.getId();
    // const networkId = await window.ethereum.request({
    //   method: "networkId",
    // });
    // console.log(networkId);
    try {
      //request accounts
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      user = accounts[0];

      //Setup BubbleFish Contract Instance and events
      instances.bubbleFish = new web3.eth.Contract(
        abi.bubbleFish,
        addresses.bubbleFish,
        {
          from: user,
        }
      );

      instances.bubbleFish.events
        .Birth()
        .on("data", (event) => {
          //[owner, tokenId, mumId, dadId, genes] = event.returnValues;
          if (birthEventLatestBlock == event.transactionHash) {
            console.log("duplicate birth");
            return;
          }
          birthEventLatestBlock = event.transactionHash;
          owner = event.returnValues.owner;
          if (owner.toLowerCase() !== user) return;
          tokenId = event.returnValues.tokenId;
          mumId = event.returnValues.mumId;
          dadId = event.returnValues.dadId;
          _genes = event.returnValues.genes;
          _generation = event.returnValues.generation;
          console.log("new fish");
          if (_generation == 0) {
            $(".newTokenFeedback").css("display", "block");
            $(".newTokenFeedback").text(
              `${owner} ${tokenId} ${mumId} ${dadId} ${_genes} ${_generation}`
            );
          } else onNewFishCreated({ _generation, _genes });
        })
        .on("error", () => {
          console.log("error");
        });
      //
      instances.bubbleFish.events
        .ApprovalForAll()
        .on("data", (event) => {
          //[owner, tokenId, mumId, dadId, genes] = event.returnValues;
          if (approvalForAllLatestBlock == event.transactionHash) {
            console.log("duplicate birth");
            return;
          }
          approvalForAllLatestBlock = event.transactionHash;
        })
        .on("error", () => {
          console.log("error");
        });

      //Setup Marketplace Contract Instance and events
      instances.marketplace = new web3.eth.Contract(
        abi.marketPlace,
        addresses.marketplace,
        {
          from: user,
        }
      );
      //event
      instances.marketplace.events
        .MarketTransaction()
        .on("data", (event) => {
          if (marketEventLatestBlock == event.transactionHash) {
            console.log("duplicate MarketTransaction");
            return;
          }
          marketEventLatestBlock = event.transactionHash;
          const owner = event.returnValues.owner;
          if (owner.toLowerCase() !== user) return;
          const txType = event.returnValues.TxType;
          if (txType == "Create offer") {
            console.log("you have created an offer");

            $(".selectedFishAction").html("Cancel");
            $(".selectedFishAction").attr(
              "onClick",
              `cancelOffer(${selectedTokenId})`
            );
            const x = $(".selectedFishInputs").html().toString().slice(0, 126);
            $(".selectedFishInputs").html(x);
          } else if (txType == "Cancel offer") {
            console.log("you have canceled");
            $(".selectedFishAction").html("Sell");
            $(".selectedFishAction").attr(
              "onClick",
              `setOffer(${selectedTokenId})`
            );
            const x = $(".selectedFishInputs").html();
            $(".selectedFishInputs").html(
              x + `<Input id = "input_ethVal" type = "number"/>`
            );
            $(`#input_ethVal`).focusout((e) => {
              if ($(`#input_ethVal`).val().length != null)
                editSellItem_EthPrice($(`#input_ethVal`).val());
            });
          } else {
            console.log("you have bought");

            $(".selectedFishAction").html("Sell");
            $(".selectedFishAction").attr(
              "onClick",
              `setOffer(${selectedTokenId})`
            );
            const x = $(".selectedFishInputs").html();
            $(".selectedFishInputs").html(
              x + `<Input id = "input_ethVal" type = "number"/>`
            );
            $(`#input_ethVal`).focusout((e) => {
              if ($(`#input_ethVal`).val().length != null)
                editSellItem_EthPrice($(`#input_ethVal`).val());
            });
          }
        })
        .on("error", () => {
          console.log("error");
        });
    } catch (error) {
      if (error.code === 4001) {
        // User rejected request
      }

      setError(error);
    }
  }
});

function _createTokenGen0() {
  const dnaStr = getDna();
  instances.bubbleFish.methods
    .createTokenGen0(dnaStr)
    .send({}, (error, txHash) => {
      if (error) alert(error.message);
      else {
        console.log(txHash);
      }
    });
}

$("#createTokenGen0").click(() => {
  _createTokenGen0();
});

async function getTokensByOwner_(passTokensFunc, listName) {
  if (instances.bubbleFish == null) return;
  const ids = await instances.bubbleFish.methods.getTokensByOwner(user).call();
  const length = ids.length;
  let tokens = [];
  for (let i = 0; i < length; ++i) {
    const e = await instances.bubbleFish.methods.getToken(ids[i]).call();
    e.id = ids[i];
    const isOnSell = await instances.marketplace.methods
      .isOnSell(ids[i])
      .call();

    if (isOnSell) {
      const tokenMarketState = await instances.marketplace.methods
        .getOffer(ids[i])
        .call();
      e.price = tokenMarketState.price;
    }
    e.isOnSell = isOnSell;
    tokens.push(e);
  }
  passTokensFunc(tokens, listName);
}

async function getTokensOnSell(passTokensFunc, ownTokens = false) {
  if (instances.marketplace == null) return;
  const ids = await instances.marketplace.methods.getAllTokenOnSale().call();
  const length = ids.length;
  let tokens = [];
  for (let i = 0; i < length; ++i) {
    const _ownerOf = await instances.bubbleFish.methods.ownerOf(ids[i]).call();
    const isOwner = _ownerOf.toLowerCase() == user;
    if (ownTokens == isOwner) {
      const e = await instances.bubbleFish.methods.getToken(ids[i]).call();
      const tokenMarketState = await instances.marketplace.methods
        .getOffer(ids[i])
        .call();
      e.price = tokenMarketState.price;
      e.isOnSell = true;
      e.id = ids[i];
      tokens.push(e);
    }
  }
  passTokensFunc(tokens);
}

function breed(dadId, mumId, breedingSuccess) {
  // alert("dadId " + dadId + " mumId " + dadId);
  instances.bubbleFish.methods.breed(dadId, mumId).send({}, (err, tx) => {
    if (err) {
      console.log("next message will be an error");
      console.log(err.message);
    } else {
      breedingSuccess();
    }
  });
}

async function setOffer(_token) {
  if (waitingForMarketAllowance) {
    if (approvalForAllLatestBlock == -1) {
      alert("you are waiting for the market to be authorized");
      return;
    }
  } else {
    const _marketHasPermission = await initMarketplace();
    if (_marketHasPermission == false) return;
  }
  console.log("Set offer");

  instances.marketplace.methods
    .setOffer(sellItem_EthPrice, _token)
    .send({}, (err, tx) => {
      if (err) {
        console.log("next message will be an error");
        console.log(err.message);
      } else {
        // console.log("create offer of token " + _token + " was successful");
      }
    });
}
function cancelOffer(_token) {
  instances.marketplace.methods.removeOffer(_token).send({}, (err, tx) => {
    if (err) {
      console.log("next message will be an error");
      console.log(err.message);
    } else {
      // console.log("cancel offer of token " + _token + " was successful");
    }
  });
}
async function buyToken(_token) {
  console.log("buy");

  const tokenOffer = await instances.marketplace.methods
    .getOffer(_token)
    .call();
  const tokenPrice = tokenOffer.price;
  instances.marketplace.methods
    .buyBubbleFish(_token)
    .send({ from: user, gas: 6000000, value: tokenPrice }, (err, tx) => {
      if (err) {
        console.log("next message will be an error");
        console.log(err.message);
      } else {
        // console.log("token bought: " + _token + " succesfully");
      }
    });
}

//

async function initMarketplace() {
  const isMarketplaceOperator = await instances.bubbleFish.methods
    .isApprovedForAll(user, addresses.marketplace)
    .call();

  if (isMarketplaceOperator == false) {
    $("#marketplaceAllowancePanel").css("display", "flex");
  }

  return isMarketplaceOperator;
}

let waitingForMarketAllowance = false;
function allowMarketHandleCollection() {
  $("#marketplaceAllowancePanel").css("display", "none");
  //console.log("allowMarketHandleCollection");
  instances.bubbleFish.methods
    .setApprovalForAll(addresses.marketplace, true)
    .send({}, (err, tx) => {
      if (err) {
        //allowance failure
        console.log("initMarketplace failed");
        initMarketplace();
      } else {
        //allowance success
        console.log("Waiting to be approved");
        waitingForMarketAllowance = true;
      }
    });
}
function cancelAllowMarketHandleCollection() {
  $("#marketplaceAllowancePanel").css("display", "none");
}
