particlesJS('particles-js',

    {
        "particles": {
            "number": {
                "value": 100,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": "#000000"
            },
            "shape": {
                "type": ["polygon", "polygon", "polygon", "polygon", "polygon", "circle", "circle"],
                "stroke": {
                    "width": 0,
                    "color": "#1fbe8cff"
                },
                "polygon": [
                    {
                        "nb_sides": 5
                    },
                    {
                        "nb_sides": 6
                    },
                    {
                        "nb_sides": 8
                    },
                    {
                        "nb_sides": 4
                    },
                    {
                        "nb_sides": 7
                    }
                ],
                "image": {
                    "src": "img/github.svg",
                    "width": 100,
                    "height": 100
                }
            },
            "opacity": {
                "value": 0.5,
                "random": false,
                "anim": {
                    "enable": false,
                    "speed": 3,
                    "opacity_min": 0.1,
                    "sync": false
                }
            },
            "size": {
                "value": 3,
                "random": true,
                "anim": {
                    "enable": false,
                    "speed": 13,
                    "size_min": 0.1,
                    "sync": false
                }
            },
            "line_linked": {
                "enable": true,
                "distance": 200,
                "color": "#FFB6D9",
                "opacity": 0.3,
                "width": 2.5
            },
            "move": {
                "enable": true,
                "speed": 1,
                "direction": "none",
                "random": false,
                "straight": false,
                "out_mode": "out",
                "bounce": false,
                "attract": {
                    "enable": false,
                    "rotateX": 600,
                    "rotateY": 1200
                }
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": false,
                    "mode": "repulse"
                },
                "onclick": {
                    "enable": false,
                    "mode": "push"
                },
                "resize": true
            },
            "modes": {
                "grab": {
                    "distance": 400,
                    "line_linked": {
                        "opacity": 1
                    }
                },
                "bubble": {
                    "distance": 400,
                    "size": 40,
                    "duration": 2,
                    "opacity": 8,
                    "speed": 3
                },
                "repulse": {
                    "distance": 200,
                    "duration": 0.4
                },
                "push": {
                    "particles_nb": 4
                },
                "remove": {
                    "particles_nb": 2
                }
            }
        },
        "retina_detect": true
    }

);

// ====================================
// Multi-color Line Animation
// ====================================
var lineColors = [
    "#FFB6D9",  // 연분홍
    "#E8B4D4",  // 라벤더 핑크
    "#D4B4E8",  // 라벤더
    "#B4D4E8",  // 라이트 블루
    "#B4E8D4",  // 민트
    "#FFD4B4",  // 연주황
    "#D9B6FF",  // 밝은 보라
    "#FF9FD4"   // 더 진한 핑크
];

var currentColorIndex = 0;

function changeLineColors() {
    var canvas = document.querySelector('canvas[data-particles="js"]');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    currentColorIndex = (currentColorIndex + 1) % lineColors.length;

    // particles 라이브러리의 내부 객체 접근
    if (window.pJSDom && window.pJSDom[0]) {
        var particlesInstance = window.pJSDom[0].pJS;
        if (particlesInstance) {
            particlesInstance.particles.line_linked.color = lineColors[currentColorIndex];
            particlesInstance.particles.line_linked.opacity = 0.7;
            particlesInstance.particles.line_linked.width = 2.5;
        }
    }
}

// 4초마다 선 색상 변경
setInterval(changeLineColors, 4000);

// ====================================
// Publication Management Functions
// ====================================

$.fn.isInViewport = function () {
    var elementTop = $(this).offset().top;
    var elementBottom = elementTop + $(this).outerHeight();
    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();
    return elementBottom > viewportTop && elementTop < viewportBottom;
};

var allPublications = null;

function publicationBySelected() {
    console.log('✓ publicationBySelected() triggered');
    var button = $("#publication-by-selected");

    // Update button states (activate this, deactivate others)
    $("#publication-by-selected, #publication-by-date").removeClass("activated");
    button.addClass("activated");

    // Clear container
    var container = $("#main-pub-card-container");
    container.html("");

    // Filter and display selected publications
    var count = 0;
    for (var i = 0; i < allPublications.length; i++) {
        var pub = $(allPublications[i]);
        if (pub.data("selected") == true || pub.data("selected") === "true") {
            container.append(pub.clone());
            count++;
        }
    }
    console.log('✓ Selected publications displayed: ' + count);
    container.removeClass("hide");
}

function publicationByDate() {
    console.log('✓ publicationByDate() triggered');
    var button = $("#publication-by-date");

    // Update button states (activate this, deactivate others)
    $("#publication-by-selected, #publication-by-date").removeClass("activated");
    button.addClass("activated");

    // Clear container
    var container = $("#main-pub-card-container");
    container.html("");

    // Sort by year descending
    var sorted = allPublications.slice().sort(function (a, b) {
        var yearA = parseInt($(a).data("year")) || 0;
        var yearB = parseInt($(b).data("year")) || 0;
        return yearB - yearA;
    });

    // Group by year and display
    var lastYear = null;
    for (var i = 0; i < sorted.length; i++) {
        var pub = $(sorted[i]);
        var year = pub.data("year");

        // Add year header if new year
        if (year !== lastYear) {
            container.append($("<h5 style='margin-top:20px; color:#566c7f;'>" + year + "</h5>"));
            lastYear = year;
        }
        container.append(pub.clone());
    }
    console.log('✓ All publications sorted by date');
    container.removeClass("hide");
}

function initPublications() {
    console.log('=== Initializing Publications ===');

    // Get all pub-card elements from the DOM
    var pubCardElements = $("#main-pub-card-container .pub-card");
    console.log('Found ' + pubCardElements.length + ' publication cards');

    // Build allPublications array (store DOM elements)
    allPublications = [];
    pubCardElements.each(function (index) {
        allPublications.push(this);
        var year = $(this).data("year");
        var selected = $(this).data("selected");
        console.log('  [' + index + '] year=' + year + ', selected=' + selected);
    });

    console.log('Ready to filter/sort ' + allPublications.length + ' publications');

    // Bind click handlers to publication filter links
    $("#publication-by-selected").on('click', function (e) {
        e.preventDefault();
        publicationBySelected();
    });

    $("#publication-by-date").on('click', function (e) {
        e.preventDefault();
        publicationByDate();
    });

    // Initialize with selected publications view
    $("#main-pub-card-container").removeClass("hide");
    publicationBySelected();

    console.log('=== Publications Ready ===\n');
}

// Initialize on DOM ready
$(function () {
    initPublications();

    // Start news-scroll slightly scrolled on page load
    var ns = $('.news-scroll');
    if (ns.length) {
        setTimeout(function () { ns.animate({ scrollTop: 20 }, 300); }, 100);
    }
});