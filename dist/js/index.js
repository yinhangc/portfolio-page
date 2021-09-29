const timelineAnimation = () => {
  const line = document.querySelector(".timeline__innerline");
  const timeline_events = document.querySelectorAll(".timeline__item");
  // Observed target for larger screen
  const target1 = document.querySelector(".timeline__list");
  let i = 0;
  // Observed target for smaller screen
  const target2 = document.querySelectorAll(".timeline__item");
  let i2 = 1;

  function showTime(e) {
    e.setAttribute("done", "true");
    e.querySelector(".timeline__point").style.background = "#FF2442";
    e.querySelector(".timeline__date").style.opacity = "100%";
    e.querySelector(".timeline__text").style.opacity = "100%";
  }

  function hideTime(e) {
    e.removeAttribute("done");
    e.querySelector(".timeline__point").style.background = "#022e57";
    e.querySelector(".timeline__date").style.opacity = "0%";
    e.querySelector(".timeline__text").style.opacity = "0%";
  }

  // Control the width / height of timeline, depending on media screen 
  function timelineProgress(value) {
    const progress = `${(value / timeline_events.length) * 100}%`;
    if (window.matchMedia("(min-width: 900px)").matches) {
      line.style.width = progress;
      line.style.height = "4px";
    } else {
      line.style.height = progress;
      line.style.width = "4px";
    }
  }

  // Slow down the animation (for larger screen)
  function slowLoop() {
    setTimeout(function () {
      showTime(timeline_events[i]);
      timelineProgress(i + 1);
      i++;
      // Call itself again until the last item is reached 
      if (i < timeline_events.length) {
        slowLoop();
      }
    }, 700);
  }

  // Timeline animates only when it comes into viewport
  let observer = new IntersectionObserver(
    // Callback 
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (window.matchMedia("(min-width: 900px)").matches) {
            console.log('hi');
            slowLoop();
          } else {
            showTime(entry.target);
            timelineProgress(i2);
            i2++;
          }
          observer.unobserve(entry.target); // Remove observer after reveal
        }
      });
    },
    // Options (100px before reaching timeline)
    {
      threshold: 1,
      // 80px before viewport reach elements
      rootMargin: "0px 0px 80px 0px"
    }
  );

  if (window.matchMedia("(min-width: 900px)").matches) {
    observer.observe(target1); // Observe the whole list 
  } else {
    target2.forEach((t) => {
      observer.observe(t); // Observe individual timeline item
    });
  }

  // Click event on timeline items
  timeline_events.forEach((li, index) => {
    li.addEventListener("click", () => {
      if (li.getAttribute("done")) {
        // Hide all timeline events after the clicked item
        timelineProgress(index + 1);
        timeline_events.forEach((ev, idx) => {
          if (idx > index) {
            hideTime(ev);
          }
        });
      } else {
        // Show all timeline events on / before the clicked item
        timelineProgress(index + 1);
        timeline_events.forEach((ev, idx) => {
          if (idx <= index) {
            showTime(ev);
          }
        });
      }
    });
  });

  // For resizing 
  let doit;
  window.addEventListener("resize", () => {
    clearTimeout(doit);
    // Only execute timeline behavior after 1.2s of resizing
    doit = setTimeout(resizeEnd, 1200);
  });

  function resizeEnd() {
    i = 0;
    slowLoop();
  }
}
timelineAnimation();

const navAction = () => {
  const header = document.querySelector('.header');
  const navToggle = document.querySelector('.header__nav-toggle');
  const navLinks = document.querySelectorAll('.nav__link')

  navToggle.addEventListener('click', () => {
    header.classList.toggle('nav-open');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      header.classList.remove('nav-open');
    })
  });
};
navAction();

const lazyImgLoading = () => {
  // Lazy loading images at 'Work' section
  const lazyImgOptions = {
    threshold: 0,
    // 300px before viewport reach img
    rootMargin: "0px 0px 300px 0px"
  };
  const images = document.querySelectorAll("[data-src]");

  const preloadImage = (img) => {
    const src = img.getAttribute("data-src");
    if (!src) return;
    img.src = src;
  }

  const imgObserver = new IntersectionObserver((entries, imgObserver) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      preloadImage(entry.target);
      imgObserver.unobserve(entry.target);
    })
  }, lazyImgOptions);

  images.forEach(img => {
    imgObserver.observe(img);
  });
};
lazyImgLoading();

const appearOnScrollAnimation = () => {
  // Fade in when appear on scroll
  const animations = document.querySelectorAll(".appearOnScroll");
  const appearOptions = {
    threshold: 1,
    // 50px before viewport reach elements
    rootMargin: "0px 0px 50px 0px"
  };
  const appearOnScroll = new IntersectionObserver(
    function (entries, appearOnScroll) {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          return;
        } else {
          if (entry.target.classList.contains('home__title') || entry.target.classList.contains('home__img-container')) {
            entry.target.classList.add('animate__fadeInDown');
          } else if (entry.target.classList.contains('home__subtitle')) {
            entry.target.classList.add('animate__fadeInRight');
          } else {
            entry.target.style.opacity = '1';
            entry.target.classList.add('animate__fadeInUp');
          }
          appearOnScroll.unobserve(entry.target);
        }
      });
    }, appearOptions);

  animations.forEach(animation => {
    appearOnScroll.observe(animation);
  })
};
appearOnScrollAnimation();

