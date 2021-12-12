$(".ChainId button").click(() => {
  $(`.ChainId`).css("display", "none");
});

let currentPage = "Home";
function goToHome() {
  currentPage = "Home";
  $(".Home").css("display", "flex");
  $(".Factory").css("display", "none");
  $(".Catalogue").css("display", "none");
  $(".Market").css("display", "none");
}
function goToCatalogue() {
  selectedFish_A = -1;
  selectedFish_B = -1;
  currentPage = "Catalogue";
  getTokens();
  $(".Catalogue").css("display", "flex");
  $(".Home").css("display", "none");
  $(".Factory").css("display", "none");
  $(".Market").css("display", "none");
}
function goToFactory() {
  currentPage = "Factory";
  $(".Factory").css("display", "flex");
  $(".Home").css("display", "none");
  $(".Catalogue").css("display", "none");
  $(".Market").css("display", "none");
}
async function goToMarket() {
  if (currentPage == "Market") return;
  currentPage = "Market";
  drawMarketTogleList();
  //

  $(".Market").css("display", "flex");
  $(".Factory").css("display", "none");
  $(".Home").css("display", "none");
  $(".Catalogue").css("display", "none");
}

goToHome(); //

$("#getYourOwnBubbleFish").click(() => {
  goToMarket();
});
$("#NavHome a").click((e) => {
  e.preventDefault();
  goToHome();
});
$("#NavCatalogue a").click((e) => {
  e.preventDefault();
  goToCatalogue();
});
$("#NavFactory a").click((e) => {
  e.preventDefault();
  goToFactory();
});

//breed
$(".breedButton").click(() => {
  //$(".bubbleFishContainer").html += `<div class = "bubbleFishFrame"> </div>`;
  // alert(selectedFish_A + " " + selectedFish_B);
  if (ownTokensMainInfo == null || ownTokensMainInfo.length < 2) {
    alert(
      "Must have at least 2 Bubble Fishes, fish count " +
        ownTokensMainInfo.length
    );
    return;
  }

  let tokens = [];
  if (ownTokensMainInfo.length == 2) {
    selectedFish_A = 0;
    selectedFish_B = 1;
    tokens = [
      ownTokensMainInfo[selectedFish_A],
      ownTokensMainInfo[selectedFish_B],
    ];
  } else {
    if (selectedFish_A !== -1 && selectedFish_B !== -1) {
      tokens = [
        ownTokensMainInfo[selectedFish_A],
        ownTokensMainInfo[selectedFish_B],
      ];
    } else {
      alert(
        "Must select at least 2 Bubble Fishes, fish count " +
          ownTokensMainInfo.length
      );
      return;
    }
  }
  // alert(
  //   "these are the fishes to breed " + selectedFish_A + " " + selectedFish_B
  // );

  list = $("#fishesToMerge");
  list.html("");
  $.each(tokens, (index, value) => {
    $(`<li class ="fish_ListElement" />`)
      .html(`<div class = "fishGoesHere">${buildFish(value)}</div>`)
      .appendTo(list);
  });

  $("#CollectionPanel").css("display", "none");
  $("#MergePanel").css("display", "flex");
});
//Cancel
$("#cancelBreeding").click(() => {
  $("#CollectionPanel").css("display", "flex");
  $("#MergePanel").css("display", "none");
});
//Confirm
$("#confirmBreeding").click(() => {
  // alert("breed " + selectedFish_A + " " + selectedFish_B);

  breed(
    ownTokensMainInfo[selectedFish_A].id,
    ownTokensMainInfo[selectedFish_B].id,
    () => {
      goToCatalogue();
      $("#CollectionPanel").css("display", "flex");
      $("#MergePanel").css("display", "none");
    }
  );
});

//CloseNewFishPanel
function onNewFishCreated(fish) {
  $(".newFish").html(`${buildFish(fish)}`);
  $(".catNewFishFeedback_Container").css("display", "block");
}
$(".closeNewBubbleFishPanel").click(() => {
  $(".catNewFishFeedback_Container").css("display", "none");
  goToCatalogue();
});
//
function getTokens() {
  getTokensByOwner_(drawBubbleFishes, "bubbleFishContainer");
}
let ownTokensMainInfo = [];
function drawBubbleFishes(tokens, listName) {
  list = $(`.${listName}`);
  list.html("");
  ownTokensMainInfo = [];
  $.each(tokens, (index, value) => {
    $(
      `<li class ="fish_ListElement" id = "id_${index}" onClick = "onFishPressed(this)"/>`
    )
      .html(
        `<div class ="fish_ListElementSelected_${index}" style = "display: none">Selected</div><div class = "fishGoesHere">${buildFish(
          value
        )}</div>`
      )
      .appendTo(list);
    ownTokensMainInfo.push({
      id: value.id,
      _genes: value._genes,
      _generation: value._generation,
    });
  });
}
//Handle breeding
let selectedFish_A = -1;
let selectedFish_B = -1;

let selectedFishToEditSell = -1;
function back_marketAction() {
  $(".selectedFishMarketPlace").css({ display: "none" }).html("");
  $(".Market_bubbleFishContainer").css({ display: "grid" });
  $(`input[type="checkbox"]`).css({ display: "flex" });
  //Go to market
  if (showMarket) {
    getTokensOnSell((tokens) => {
      drawBubbleFishes(tokens, "Market_bubbleFishContainer");
    }, false);
  } //Go to own Items on Sell
  else {
    getTokensOnSell((_ownTokensOnSell) => {
      ownTokensOnSell = _ownTokensOnSell;
      getTokensByOwner_((_tokens, tokenList) => {
        drawBubbleFishes(_tokens, tokenList);
      }, "Market_bubbleFishContainer"); //HERE_0
    }, true);
  }
}
let sellItem_EthPrice = 1;
function editSellItem_EthPrice(_price) {
  sellItem_EthPrice = `${Math.round(_price * 10 ** 18)}`;
}
let selectedTokenId = 0;
function onFishPressed(btn) {
  if (currentPage == "Market") {
    selectedFishToEditSell = btn.id.split("_")[1];
    $(".Market_bubbleFishContainer").css({ display: "none" });
    $(`input[type="checkbox"]`).css({ display: "none" });
    let isOnSell = false;

    for (let i = 0; i < ownTokensOnSell.length; ++i) {
      if (
        ownTokensOnSell[i]._genes ==
        ownTokensMainInfo[selectedFishToEditSell]._genes
      ) {
        isOnSell = true;
        break;
      }
    }

    selectedTokenId = ownTokensMainInfo[selectedFishToEditSell].id;
    $(".selectedFishMarketPlace")
      .css({ display: "flex" })
      .html(
        `${buildFish(
          ownTokensMainInfo[selectedFishToEditSell]
        )}<div class="selectedFishInputs" style = "margin-top:25px"><button onClick = "back_marketAction()">Back</button><button class ="selectedFishAction" onClick = ${
          showMarket
            ? `buyToken(${selectedTokenId})`
            : !isOnSell
            ? `setOffer(${selectedTokenId})`
            : `cancelOffer(${selectedTokenId})`
        }>${showMarket ? "Buy" : !isOnSell ? "Sell" : "Cancell"}</button> ${
          showMarket || isOnSell
            ? ""
            : `<Input id = "input_ethVal" type = "number"/>`
        }</div>`
      );
    $(`#input_ethVal`).focusout((e) => {
      if ($(`#input_ethVal`).val().length != null)
        editSellItem_EthPrice($(`#input_ethVal`).val());
    });
    return;
  }
  const fishIndex = btn.id.split("_")[1];
  const classTarget = `.fish_ListElementSelected_${fishIndex}`;
  console.log(fishIndex);
  if (selectedFish_A == -1) {
    selectedFish_A = fishIndex;
    $(classTarget).css("display", "block");
    $(classTarget).addClass("fish_ListElementSelected");
  } else {
    if (selectedFish_A == fishIndex) {
      $(classTarget).css("display", "none");
      $(classTarget).removeClass("fish_ListElementSelected");
      selectedFish_A = -1;
    } else {
      if (selectedFish_B == -1) {
        selectedFish_B = fishIndex;
        $(classTarget).css("display", "block");
        $(classTarget).addClass("fish_ListElementSelected");
      } else {
        if (selectedFish_B == fishIndex) {
          selectedFish_B = -1;
          $(classTarget).css("display", "none");
          $(classTarget).removeClass("fish_ListElementSelected");
        } else {
          $(`.fish_ListElementSelected_${selectedFish_B}`).css(
            "display",
            "none"
          );
          $(`.fish_ListElementSelected_${selectedFish_B}`).removeClass(
            "fish_ListElementSelected"
          );
          selectedFish_B = fishIndex;
          $(classTarget).css("display", "block");
          $(classTarget).addClass("fish_ListElementSelected");
        }
      }
    }
  }
}

//Draw fishes on cataloge
const _mouthShape = ["50%", "5%", "25%"];
const _sideFinAndEyeShape = ["50%", "10%", "30%"];
const _eyebrowType_L = [
  "",
  "normalEyebrowStyle",
  "normalEyebrowStyle tiltLeftEyebrow",
];
const _eyebrowType_R = [
  "",
  "normalEyebrowStyle",
  "normalEyebrowStyle tiltRightEyebrow",
];
const _animTypes = ["fishSideAnim", "fishRotAnim", "fishUpAnim"];
function buildFish(value) {
  const topColorIndex = breakDownGenes(value._genes, 1000000000000, 2);
  const bottomColorIndex = breakDownGenes(value._genes, 10000000000, 2);
  const upperFinsColorIndex = breakDownGenes(value._genes, 100000000, 2);
  const lowerFinsColorIndex = breakDownGenes(value._genes, 1000000, 2);

  const mouthShapeIndex = breakDownGenes(value._genes, 100000, 1) - 1;
  const sideFinShapeIndex = breakDownGenes(value._genes, 10000, 1) - 1;
  const eyeShapeIndex = breakDownGenes(value._genes, 1000, 1) - 1;
  const eyebrowsIndex = breakDownGenes(value._genes, 100, 1) - 1;
  const animationsIndex = breakDownGenes(value._genes, 10, 1) - 1;
  // console.log(value._genes + "  " + eyebrowsIndex);
  return `<div class="fish_container">
  ${
    value.isOnSell != null && value.isOnSell
      ? `<div class="fishOnSell ${
          showMarket && currentPage == "Market" ? "fishOnSellOthers" : ""
        }">${value.price / 1000000000000000000}AVAX</div>`
      : ""
  }
  <div class="Animator ${_animTypes[animationsIndex]}">
    <div class="back_fin" style = "background-color: ${
      colors[lowerFinsColorIndex] //4
    }"></div>
    <div class="lower_fin" style = "background-color: ${
      colors[lowerFinsColorIndex] //4
    }"></div>
    <div class="upper_fin lower_fin" style = "background-color: ${
      colors[upperFinsColorIndex] //3
    }"></div>
    <div class="fish" style = "background-color: ${
      colors[bottomColorIndex] //2
    }">
      <div class="topFish" style = "background-color: ${
        colors[topColorIndex] //1
      }"></div>
      <div class="mouth-border" style = "background-color: ${
        colors[topColorIndex] //1
      }; border-radius: ${_mouthShape[mouthShapeIndex]}">
        <div class="mouth" style = "background-color: ${
          colors[bottomColorIndex] //2
        }; border-radius: ${_mouthShape[mouthShapeIndex]}"></div>
      </div>
      <div class="eye" style = "border-radius: ${
        _sideFinAndEyeShape[eyeShapeIndex]
      }">
        <div class="pupile"></div>
        <div class="eyebrow_l ${
          _eyebrowType_L[eyebrowsIndex]
        }" style = "background-color: ${
    colors[bottomColorIndex] //2
  }"></div>
      </div>
      <div class="eye eyer_r" style = "border-radius: ${
        _sideFinAndEyeShape[eyeShapeIndex]
      }">
        <div class="pupile"></div>
        <div class="eyebrow_r ${
          _eyebrowType_R[eyebrowsIndex]
        }" style = "background-color: ${
    colors[bottomColorIndex] //2
  }"></div>
      </div>
    </div>
    <div class="side_fin" style = "background-color: ${
      colors[upperFinsColorIndex] //3
    }; border-radius: ${_sideFinAndEyeShape[sideFinShapeIndex]}"></div>
    <div class="gill" style = "background-color: ${
      colors[topColorIndex] //1
    }"></div>
  </div>
  <div class="fishGen">Gen ${value._generation}</div>
  <div class="dnaDiv" id="catDNA">
    <b>
      DNA:
      <!-- Colors -->
      <span id="dnabody">${topColorIndex}</span>
      <span id="dnalowerbody">${bottomColorIndex}</span>
      <span id="dnaupperfins">${upperFinsColorIndex}</span>
      <span id="dnalowerfins">${bottomColorIndex}</span>
  
      <!-- Cattributes -->
      <span id="dnamouthshape">${mouthShapeIndex + 1}</span>
      <span id="dnasidefin">${sideFinShapeIndex + 1}</span>
      <span id="dnaeyeshape">${eyeShapeIndex + 1}</span>
      <span id="dnaeyebrown">${eyebrowsIndex + 1}</span>
      <span id="dnaanimation">${animationsIndex + 1}</span>
      <span id="dnaspecial">${1}</span>
    </b>
  </div>
  </div>`;
}

//MarketPlace
$(".startButton").click(() => {
  goToMarket();
});

let showMarket = true;

let ownTokensOnSell = [];
$(`input[type="checkbox"]`).click(() => {
  showMarket = !showMarket;
  drawMarketTogleList();
});
function drawMarketTogleList() {
  $(".selectedFishMarketPlace").css({ display: "none" }).html("");
  //Go to market
  if (showMarket) {
    getTokensOnSell((tokens) => {
      drawBubbleFishes(tokens, "Market_bubbleFishContainer");
    }, false);
  } //Go to own Items on Sell
  else {
    getTokensOnSell((_ownTokensOnSell) => {
      ownTokensOnSell = _ownTokensOnSell;
      // console.log(ownTokensOnSell);
      getTokensByOwner_((_tokens, tokenList) => {
        drawBubbleFishes(_tokens, tokenList);
        // console.log(_tokens);
      }, "Market_bubbleFishContainer");
    }, true);
  }
}
//

function breakDownGenes(_genes, _ceroDisplacement = 1, _length = 1) {
  return Math.floor((_genes / _ceroDisplacement) % Math.pow(10, _length));
}
