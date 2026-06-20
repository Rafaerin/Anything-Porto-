var scrollBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', function () {
  scrollBtn.style.display = window.scrollY > 300 ? 'flex' : 'none';
});

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateClock() {
  var now = new Date();
  var hours = String(now.getHours()).padStart(2, '0');
  var minutes = String(now.getMinutes()).padStart(2, '0');
  var seconds = String(now.getSeconds()).padStart(2, '0');
  document.getElementById('clock').textContent = hours + ':' + minutes + ':' + seconds;

  var hour = now.getHours();
  var greeting;
  if (hour >= 5 && hour < 12) {
    greeting = 'Selamat Pagi!';
  } else if (hour >= 12 && hour < 15) {
    greeting = 'Selamat Siang!';
  } else if (hour >= 15 && hour < 18) {
    greeting = 'Selamat Sore!';
  } else {
    greeting = 'Selamat Malam!';
  }
  document.getElementById('greeting').textContent = greeting;
}

setInterval(updateClock, 1000);
updateClock();

function highlightSection(targetId) {
  var target = document.getElementById(targetId);
  if (!target) return;

  var card = target.querySelector('.bento-card') || target;
  card.classList.remove('highlight');
  void card.offsetWidth;
  card.classList.add('highlight');

  setTimeout(function () {
    card.classList.remove('highlight');
  }, 3200);
}

function openLightbox(img) {
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  var lightbox = document.getElementById('lightbox');
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeLightbox();
});

document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.getElementById('navbarToggle');
  var menu = document.getElementById('navbarMenu');

  toggle.addEventListener('click', function () {
    menu.classList.toggle('active');
    toggle.classList.toggle('active');
  });

  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      menu.classList.remove('active');
      toggle.classList.remove('active');

      var href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        var targetId = href.substring(1);

        menu.querySelectorAll('a').forEach(function (a) {
          a.classList.remove('active-nav');
        });
        this.classList.add('active-nav');

        highlightSection(targetId);
      }
    });
  });

  document.querySelectorAll('[data-carousel]').forEach(function (el) {
    new Carousel(el);
  });
});

function Carousel(element) {
  this.element = element;
  this.track = element.querySelector('.carousel-track');
  this.slides = element.querySelectorAll('.carousel-slide');
  this.prevBtn = element.querySelector('[data-carousel-prev]');
  this.nextBtn = element.querySelector('[data-carousel-next]');
  this.dotsContainer = element.querySelector('[data-carousel-dots]');
  this.interval = parseInt(element.dataset.interval) || 5000;
  this.currentIndex = 0;
  this.totalSlides = this.slides.length;
  this.isPlaying = true;
  this.autoPlayTimer = null;
  var self = this;

  this.createDots = function () {
    for (var i = 0; i < self.totalSlides; i++) {
      var dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      dot.setAttribute('data-index', i);
      (function (idx) {
        dot.addEventListener('click', function () { self.goToSlide(idx); });
      })(i);
      self.dotsContainer.appendChild(dot);
    }
  };

  this.goToSlide = function (index) {
    self.currentIndex = index;
    self.track.style.transform = 'translateX(-' + (index * 100) + '%)';
    var dots = self.dotsContainer.querySelectorAll('.carousel-dot');
    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === index);
    });

    var songTitle = self.slides[index].getAttribute('data-song');
    if (songTitle) {
      var npEl = document.getElementById('musicNowPlaying');
      if (npEl) {
        npEl.style.opacity = '0';
        setTimeout(function () {
          npEl.textContent = songTitle;
          npEl.style.opacity = '1';
        }, 200);
      }

      var tracks = document.querySelectorAll('.track-item');
      tracks.forEach(function (track, i) {
        track.classList.toggle('active', i === index);
      });
    }
  };

  this.next = function () {
    self.goToSlide((self.currentIndex + 1) % self.totalSlides);
  };

  this.prev = function () {
    self.goToSlide((self.currentIndex - 1 + self.totalSlides) % self.totalSlides);
  };

  this.startAutoPlay = function () {
    self.autoPlayTimer = setInterval(function () {
      if (self.isPlaying) self.next();
    }, self.interval);
  };

  this.stopAutoPlay = function () {
    clearInterval(self.autoPlayTimer);
  };

  this.createDots();
  this.goToSlide(0);

  this.nextBtn.addEventListener('click', function () {
    self.next();
    self.stopAutoPlay();
    self.startAutoPlay();
  });
  this.prevBtn.addEventListener('click', function () {
    self.prev();
    self.stopAutoPlay();
    self.startAutoPlay();
  });
  this.element.addEventListener('mouseenter', function () { self.isPlaying = false; });
  this.element.addEventListener('mouseleave', function () { self.isPlaying = true; });

  this.startAutoPlay();
}
