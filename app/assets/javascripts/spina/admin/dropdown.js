$(document).on("click", "body.dropdown", function() {
  return closeDropdown();
});

$(document).on("click", "[data-trigger=\"dropdown\"]", function() {
  var trigger = $(this);
  var dropdown = $(trigger.attr("data-target"));
  var body = $("body");

  if (body.hasClass("dropdown")) {
    trigger.removeClass("button-active");
    body.removeClass("dropdown");
    dropdown.removeClass("animated fadeInDown");
  } else {
    dropdown.removeClass("no-animation");
    trigger.addClass("button-active");
    body.addClass("dropdown");
    dropdown.addClass("animated fadeInDown");
  }

  return false;
});

$(document).on(
  "click",
  "[data-dropdown] ul, [data-dropdown] .sliding-dropdown",
  function(e) {
    return e.stopPropagation();
  }
);

$(document).on("click", ".slide-controls .previous, .slide-controls .next", function(e) {
  var target;
  e.preventDefault();
  var sliding_dropdown = $(this).parents(".sliding-dropdown");
  var active_title = sliding_dropdown.find(".slide-title.active");
  var previous = active_title.prev(".slide-title");
  var next = active_title.next(".slide-title");

  if ($(this).hasClass("previous") && previous.length > 0) {
    sliding_dropdown.find(".slide-title").removeClass("active");
    previous.addClass("active");
    target = previous.data("target");
    sliding_dropdown.find(".slide").removeClass("active");
    $(target).addClass("active");
  } else if ($(this).hasClass("next") && next.length > 0) {
    sliding_dropdown.find(".slide-title").removeClass("active");
    next.addClass("active");
    target = next.data("target");
    sliding_dropdown.find(".slide").removeClass("active");
    $(target).addClass("active");
  }

  if (sliding_dropdown.find(".slide-title.active").next(".slide-title").length > 0) {
    sliding_dropdown.find(".next").removeClass("muted");
  } else {
    sliding_dropdown.find(".next").addClass("muted");
  }

  if (sliding_dropdown.find(".slide-title.active").prev(".slide-title").length > 0) {
    sliding_dropdown.find(".previous").removeClass("muted");
  } else {
    sliding_dropdown.find(".previous").addClass("muted");
  }

  sliding_dropdown.addClass("no-animation");
  return forceRedraw(sliding_dropdown[0]);
});

var closeDropdown = function() {
  $("body").removeClass("dropdown");
  $("[data-dropdown] ul, [data-dropdown] .sliding-dropdown").removeClass("animated fadeInDown");
  $("[data-trigger=\"dropdown\"]").removeClass("button-active");
  return false;
};

var forceRedraw = function(element) {
  var disp = element.style.display;
  element.style.display = "none";
  var trick = element.offsetHeight;
  return element.style.display = disp;
};