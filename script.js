$(document).ready(function() {
$('#fullpage').fullpage();
});
function showaboutme() {
  aboutme.classList.add("animated", "fadeInLeft");
  document.getElementById("aboutme").style.visibility = "visible";
}
function hideaboutme() {
  aboutme.classList.remove("fadeInRight")
  aboutme.classList.add("fadeOutLeft")
}
function showskills() {
  skills.classList.add("animated", "fadeInRight");
  document.getElementById("skills").style.visibility = "visible";
}
function hideskills() {
  skills.classList.remove("fadeInLeft")
  skills.classList.add("fadeOutRight")
}
