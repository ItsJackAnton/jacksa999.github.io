var colors = Object.values(allColors());

const defaultDNA = {
  headcolor: 10,
  lowerbodycolor: 35,
  upperfins: 11,
  lowerfins: 12,
  //Cattributes
  mouthShape: 2,
  sideFinShape: 3,
  eyeShape: 1,
  eyebrowType: 2,
  animation: 1,
  lastNum: 1,
};
let DNA = {
  headcolor: 10,
  lowerbodycolor: 35,
  upperfins: 26,
  lowerfins: 44,
  //Cattributes
  mouthShape: 2,
  sideFinShape: 3,
  eyeShape: 1,
  eyebrowType: 2,
  animation: 1,
  lastNum: 1,
};

// when page load
$(document).ready(function () {
  AppInit();
});
function AppInit() {
  $("#dnabody").html(defaultDNA.headcolor);
  $("#dnalowerbody").html(defaultDNA.lowerbodycolor);
  $("#dnaupperfins").html(defaultDNA.upperfins);
  $("#dnalowerfins").html(defaultDNA.lowerfins);

  $("#dnamouthshape").html(defaultDNA.mouthShape);
  $("#dnasidefin").html(defaultDNA.sideFinShape);
  $("#dnaeyeshape").html(defaultDNA.eyeShape);
  $("#eyebrowType").html(defaultDNA.eyebrowType);
  $("#dnaanimation").html(defaultDNA.animation);
  $("#dnaspecial").html(defaultDNA.lastNum);

  DNA = { ...defaultDNA };

  renderBubbleFish(DNA);
}

function getDna() {
  var dna = "";
  dna += $("#dnabody").html();
  dna += $("#dnalowerbody").html();
  dna += $("#dnaupperfins").html();
  dna += $("#dnalowerfins").html();

  dna += $("#dnamouthshape").html();
  dna += $("#dnasidefin").html();
  dna += $("#dnaeyeshape").html();
  dna += $("#dnaeyebrown").html();
  dna += $("#dnaanimation").html();
  dna += $("#dnaspecial").html();

  return parseInt(dna);
}

function renderBubbleFish(dna) {
  headColor(colors[dna.headcolor], dna.headcolor);
  $("#bodycolor").val(dna.headcolor);

  lowerBodyColor(colors[dna.lowerbodycolor], dna.lowerbodycolor);
  $("#lowerbodycolor").val(dna.lowerbodycolor);

  upperFinsColor(colors[dna.upperfins], dna.upperfins);
  $("#upperfinscolor").val(dna.upperfins);

  lowerFinsColor(colors[dna.lowerfins], dna.lowerfins);
  $("#lowerfinscolor").val(dna.lowerfins);
  //
  mouthShape(dna.mouthShape);
  $("#mouthshape").val(dna.mouthShape);

  SideFinShape(dna.sideFinShape);
  $("#sidefinshape").val(dna.sideFinShape);

  EyeShape(dna.eyeShape);
  $("#eyeshape").val(dna.eyeShape);

  EyebrownType(dna.eyebrowType);
  $("#eyebrownType").val(dna.eyebrowType);

  AnimType(dna.animation);
  $("#animationType").val(dna.animation);
}

// Changing cat colors
function InitColorSliders() {
  $("#bodycolor").change(() => {
    DNA.headcolor = $("#bodycolor").val();
    headColor(colors[DNA.headcolor], DNA.headcolor);
  });
  $("#lowerbodycolor").change(() => {
    DNA.lowerbodycolor = $("#lowerbodycolor").val();
    lowerBodyColor(colors[DNA.lowerbodycolor], DNA.lowerbodycolor);
  });
  $("#upperfinscolor").change(() => {
    DNA.upperfins = $("#upperfinscolor").val();
    upperFinsColor(colors[DNA.upperfins], DNA.upperfins);
  });
  $("#lowerfinscolor").change(() => {
    DNA.lowerfins = $("#lowerfinscolor").val();
    lowerFinsColor(colors[DNA.lowerfins], DNA.lowerfins);
  });
}
InitColorSliders();
function InitAttributeSlider() {
  $("#mouthshape").change(() => {
    DNA.mouthShape = $("#mouthshape").val();
    mouthShape(DNA.mouthShape);
  });
  $("#sidefinshape").change(() => {
    DNA.sideFinShape = $("#sidefinshape").val();
    SideFinShape(DNA.sideFinShape);
  });
  $("#eyeshape").change(() => {
    DNA.eyeShape = $("#eyeshape").val();
    EyeShape(DNA.eyeShape);
  });
  $("#eyebrownType").change(() => {
    DNA.eyebrowType = $("#eyebrownType").val();
    EyebrownType(DNA.eyebrowType);
  });
  $("#animationType").change(() => {
    DNA.animation = $("#animationType").val();
    AnimType(DNA.animation);
  });
}

$("#toggleSettings").click(() => {
  if ($("#toggleSettings").html() == "Colors") {
    $("#toggleSettings").html("Attributes");
    $("#colors").html("");
    $("#attributes").html(`
    <div class="form-group">
    <label for="formControlRange"><b>Mouth Shape</b><span class="badge badge-dark ml-2" id="mouthcode"></span></label>
    <input type="range" min="1" max="3" class="form-control-range" id="mouthshape">
</div>
<div class="form-group">
  <label for="formControlRange"><b>Side Fin Shape</b><span class="badge badge-dark ml-2" id="sidefincode"></span></label>
  <input type="range" min="1" max="3" class="form-control-range" id="sidefinshape">
  </div>
  <div class="form-group">
    <label for="formControlRange"><b>Eye Shape</b><span class="badge badge-dark ml-2" id="eyecode"></span></label>
    <input type="range" min="1" max="3" class="form-control-range" id="eyeshape">
  </div>
  <div class="form-group">
    <label for="formControlRange"><b>Eyebrow</b><span class="badge badge-dark ml-2" id="eyebrowncode"></span></label>
    <input type="range" min="1" max="3" class="form-control-range" id="eyebrownType">
  </div>
  <div class="form-group">
    <label for="formControlRange"><b>Animation Type</b><span class="badge badge-dark ml-2" id="animationcode"></span></label>
    <input type="range" min="1" max="3" class="form-control-range" id="animationType">
  </div>
    `);
    renderBubbleFish(DNA);
    InitAttributeSlider();
  } else {
    $("#toggleSettings").html("Colors");
    $("#attributes").html("");
    $("#colors").html(
      `
      <div class="form-group">
      <label for="formControlRange"><b>Upper Body</b><span class="badge badge-dark ml-2" id="headcode"></span></label>
      <input type="range" min="10" max="91" class="form-control-range" id="bodycolor">
  </div>
  <div class="form-group">
      <label for="formControlRange"><b>Lower Body</b><span class="badge badge-dark ml-2" id="lowerbodycode"></span></label>
      <input type="range" min="10" max="91" class="form-control-range" id="lowerbodycolor">
  </div>
  <div class="form-group">
      <label for="formControlRange"><b>Upper Fins</b><span class="badge badge-dark ml-2" id="upperfinscode"></span></label>
      <input type="range" min="10" max="91" class="form-control-range" id="upperfinscolor">
  </div>
  <div class="form-group">
      <label for="formControlRange"><b>Lower Fins</b><span class="badge badge-dark ml-2" id="lowerfinscode"></span></label>
      <input type="range" min="10" max="91" class="form-control-range" id="lowerfinscolor">
  </div>
      `
    );
    renderBubbleFish(DNA);
    InitColorSliders();
  }
});

$("#defaultToken").click(() => {
  DNA = { ...defaultDNA };

  renderBubbleFish(DNA);
  InitColorSliders();
  InitAttributeSlider();
});
$("#randToken").click(() => {
  DNA = {
    headcolor: Math.floor(map(Math.random() * 10, 0, 10, 10, 91)),
    lowerbodycolor: Math.floor(map(Math.random() * 10, 0, 10, 10, 91)),
    upperfins: Math.floor(map(Math.random() * 10, 0, 10, 10, 91)),
    lowerfins: Math.floor(map(Math.random() * 10, 0, 10, 10, 91)),
    //Cattributes
    mouthShape: Math.floor(map(Math.random() * 10, 0, 10, 1, 4)),
    sideFinShape: Math.floor(map(Math.random() * 10, 0, 10, 1, 4)),
    eyeShape: Math.floor(map(Math.random() * 10, 0, 10, 1, 4)),
    eyebrowType: Math.floor(map(Math.random() * 10, 0, 10, 1, 4)),
    animation: Math.floor(map(Math.random() * 10, 0, 10, 1, 4)),
    lastNum: Math.floor(map(Math.random() * 10, 0, 10, 1, 4)),
  };
  renderBubbleFish(DNA);
  InitColorSliders();
  InitAttributeSlider();
});

function map(val, iMin, iMax, oMin, oMax) {
  return ((val - iMin) * (oMax - oMin)) / (iMax - iMin) + oMin;
}
