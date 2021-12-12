//Random color
function getColor() {
  var randomColor = Math.floor(Math.random() * 16777215).toString(16);
  return randomColor;
}

function genColors() {
  var colors = [];
  for (var i = 10; i < 99; i++) {
    var color = getColor();
    colors[i] = color;
  }
  return colors;
}

//This function code needs to modified so that it works with Your cat code.
function headColor(color, code) {
  document.documentElement.style.setProperty("--top_body_color", color);
  $("#headcode").html("code: " + code); //This updates text of the badge next to the slider
  $("#dnabody").html(code); //This updates the body color part of the DNA that is displayed below the cat
}
function lowerBodyColor(color, code) {
  document.documentElement.style.setProperty("--bottom_body_color", color);
  $("#lowerbodycode").html("code: " + code); //This updates text of the badge next to the slider
  $("#dnalowerbody").html(code); //This updates the body color part of the DNA that is displayed below the cat
}
function upperFinsColor(color, code) {
  document.documentElement.style.setProperty("--top_fins_color", color);
  $("#upperfinscode").html("code: " + code); //This updates text of the badge next to the slider
  $("#dnaupperfins").html(code); //This updates the body color part of the DNA that is displayed below the cat
}
function lowerFinsColor(color, code) {
  document.documentElement.style.setProperty("--bottom_fins_color", color);
  $("#lowerfinscode").html("code: " + code); //This updates text of the badge next to the slider
  $("#dnalowerfins").html(code); //This updates the body color part of the DNA that is displayed below the cat
}
function mouthShape(shape) {
  $("#dnamouthshape").html(shape); //This updates the body color part of the DNA that is displayed below the cat

  switch (+shape) {
    case 2:
      $("#mouthcode").html("Boxy");
      $(".mouth").css("border-radius", "5%");
      $(".mouth-border").css("border-radius", "5%");
      break;
    case 3:
      $("#mouthcode").html("SemiBoxy");
      $(".mouth").css("border-radius", "25%");
      $(".mouth-border").css("border-radius", "25%");
      break;
    default:
      $("#mouthcode").html("Rounded");
      $(".mouth").css("border-radius", "50%");
      $(".mouth-border").css("border-radius", "50%");
  }
}
function SideFinShape(shape) {
  $("#dnasidefin").html(shape);

  switch (+shape) {
    case 2:
      $("#sidefincode").html("Boxy");
      $(".side_fin").css("border-radius", "10%");
      break;
    case 3:
      $("#sidefincode").html("SemiBoxy");
      $(".side_fin").css("border-radius", "30%");
      break;
    default:
      $("#sidefincode").html("Rounded");
      $(".side_fin").css("border-radius", "50%");
  }
}
function EyeShape(shape) {
  $("#dnaeyeshape").html(shape);

  switch (+shape) {
    case 2:
      $("#eyeshapecode").html("Boxy");
      $(".eye").css("border-radius", "10%");
      break;
    case 3:
      $("#eyeshapecode").html("SemiBoxy");
      $(".eye").css("border-radius", "30%");
      break;
    default:
      $("#eyeshapecode").html("Rounded");
      $(".eye").css("border-radius", "50%");
  }
}
var colors = Object.values(allColors());
function EyebrownType(shape) {
  $("#dnaeyebrown").html(shape);

  switch (+shape) {
    case 2:
      $("#eyebrowncode").html("Worry");
      $(".eyebrow_l").addClass("normalEyebrowStyle");
      $(".eyebrow_r").addClass("normalEyebrowStyle");
      $(".eyebrow_l").removeClass("tiltLeftEyebrow");
      $(".eyebrow_r").removeClass("tiltRightEyebrow");
      break;
    case 3:
      $("#eyebrowncode").html("Mad");
      $(".eyebrow_l").addClass("normalEyebrowStyle");
      $(".eyebrow_r").addClass("normalEyebrowStyle");
      $(".eyebrow_l").addClass("tiltLeftEyebrow");
      $(".eyebrow_r").addClass("tiltRightEyebrow");

      break;
    default:
      $("#eyebrowncode").html("None");
      $(".eyebrow_l").removeClass("normalEyebrowStyle");
      $(".eyebrow_r").removeClass("normalEyebrowStyle");
      $(".eyebrow_l").removeClass("tiltLeftEyebrow");
      $(".eyebrow_r").removeClass("tiltRightEyebrow");
  }
}
function AnimType(shape) {
  $("#dnaanimation").html(shape);
  $(".Animator").removeClass("fishUpAnim");
  $(".Animator").removeClass("fishRotAnim");
  $(".Animator").removeClass("fishSideAnim");
  switch (+shape) {
    case 2:
      $("#animationcode").html("Rotation");
      $(".Animator").addClass("fishRotAnim");
      break;
    case 3:
      $("#animationcode").html("Up&Down");
      $(".Animator").addClass("fishUpAnim");
      break;
    default:
      $("#animationcode").html("Side");
      $(".Animator").addClass("fishSideAnim");
  }
}
//###################################################
//Functions below will be used later on in the project
//###################################################
