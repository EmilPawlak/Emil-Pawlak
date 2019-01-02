$(document).ready(function() {
$('#fullpage').fullpage();
});
function showaboutme() {
  aboutme.classList.add("animated", "fadeInLeft");
  document.getElementById("aboutme").style.visibility = "visible";
  aboutme.classList.remove("fadeOutLeft");
}
function hideaboutme() {
  aboutme.classList.remove("fadeInLeft");
  aboutme.classList.add("fadeOutLeft");
}
function showskills() {
  skills.classList.add("animated", "fadeInRight");
  document.getElementById("skills").style.visibility = "visible";
  skills.classList.remove("fadeOutRight");
}
function hideskills() {
  skills.classList.remove("fadeInRight");
  skills.classList.add("fadeOutRight");
}
function showbackend() {
  backend.classList.remove("bounceOutRight");
  backend.classList.add("animated", "bounceInRight");
  document.getElementById('backend').style.visibility = "visible";
  frontend.classList.add("animated", "bounceOutRight");
}
function showfrontend() {
  backend.classList.remove("bounceInRight");
  backend.classList.add("bounceOutRight");
  document.getElementById('frontend').style.visibility = "visible";
  frontend.classList.remove("bounceOutRight");
  frontend.classList.add("bounceInRight");
}
function closeall(){
  aboutme.classList.remove("fadeInLeft");
  aboutme.classList.add("fadeOutLeft");
  skills.classList.remove("fadeInRight");
  skills.classList.add("fadeOutRight");
}
