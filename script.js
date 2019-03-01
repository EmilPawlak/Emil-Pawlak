$(document).ready(function() {
$('#fullpage').fullpage();
});

$('.displayAboutMe').click(function(e){
    e.stopPropagation();
    $('#aboutme').show();
});

$("#portfolioScroll").click(function() {
    $('html,body').animate({
        scrollTop: $(".evenlayout").offset().top},
        'slow');
});

$(document).mouseup(function(e)
{
    var container = $("#aboutme");
    if (!container.is(e.target) && container.has(e.target).length === 0  && container.is(".col-lg-4"))
    {
      container.hide();
    } else {
      container.show();
    }
});

function closeall(){
  aboutme.classList.remove("fadeInLeft");
  aboutme.classList.add("fadeOutLeft");
  skills.classList.remove("fadeInRight");
  skills.classList.add("fadeOutRight");
}

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
  backend.classList.add("animated");
  backend.classList.add("bounceInRight");
  backEndBtn.classList.remove("btn-outline-off", "btn-off", "btn-orange:active");
  backEndBtn.classList.add("btn-outline-orange", "btn-outline-orange:hover", "btn-orange:active");
  document.getElementById('backend').style.visibility = "visible";
  frontEndBtn.classList.remove("btn-outline-orange", "btn-orange");
  frontEndBtn.classList.add("btn-outline-off", "btn-off");
  frontend.classList.add("animated", "bounceOutRight");
}
function showfrontend() {
  backend.classList.remove("bounceInRight");
  backend.classList.add("bounceOutRight");
  backEndBtn.classList.remove("btn-outline-orange", "btn-orange");
  backEndBtn.classList.add("btn-outline-off", "btn-off");
  document.getElementById('frontend').style.visibility = "visible";
  frontEndBtn.classList.remove("btn-outline-off", "btn-off", "btn-orange:active");
  frontEndBtn.classList.add("btn-outline-orange", "btn-outline-orange:hover", "btn-orange:active");
  frontend.classList.remove("bounceOutRight");
  frontend.classList.add("bounceInRight");
}
