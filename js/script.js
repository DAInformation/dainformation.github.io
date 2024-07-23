// Semester Contents
const coursesContainer = document.getElementById("courses-container");
const semesterBtns = document.querySelectorAll(".semester-btn");
const specializationBtns = document.querySelectorAll(".specialization-btn");

Promise.all([
  fetch("js/courses.json").then((response) => response.json()),
  fetch("js/professors.json").then((response) => response.json()),
])
  .then(([coursesData, professorsData]) => {
    const jsonData = {
      courses: coursesData,
      professors: professorsData.professors,
    };

    for (const semester of jsonData.courses.semesters) {
      const semesterContainer = Object.assign(document.createElement("div"), {
        id: "semester" + (jsonData.courses.semesters.indexOf(semester) + 1),
        className: "semester",
      });

      for (const course of semester.courses) {
        const courseContainer = Object.assign(document.createElement("div"), {
          className: "course",
        });

        const title = Object.assign(document.createElement("h3"), {
          textContent: course.title,
        });

        const code = Object.assign(document.createElement("h6"), {
          textContent: course.code,
        });

        const intro = Object.assign(document.createElement("p"), {
          innerHTML: course.introduction,
        });

        const professorContainer = Object.assign(document.createElement("ul"), {
          classList: "professor-container",
        });

        const professors = jsonData.professors
          .filter((professor) => course.professor.includes(professor.id))
          .map((professor) => professor)
          .sort((a, b) => a.name.localeCompare(b.name));

        professors.forEach((professor) => {
          const url = professor.url || `https://uom.gr/${professor.id}`;
          const professorElement = Object.assign(document.createElement("li"), {
            innerHTML: `<a href="${url}" target="_blank">${professor.name}</a>`,
          });

          professorContainer.appendChild(professorElement);
        });

        const linkContainer = document.createElement("div");
        linkContainer.classList.add("link-container");

        if (course.github) {
          let [link, img] = ["a", "img"].map((tag) =>
            Object.assign(
              document.createElement(tag),
              tag === "a"
                ? { href: course.github, target: "_blank" }
                : {
                    src: "/assets/github.webp",
                    alt: "GitHub Link",
                    classList: ["course-image"],
                  }
            )
          );

          link.appendChild(img);
          linkContainer.appendChild(link);
        }

        if (course.url) {
          let [link, img] = ["a", "img"].map((tag) =>
            Object.assign(
              document.createElement(tag),
              tag === "a"
                ? { href: course.url, target: "_blank" }
                : {
                    src: `../assets/${
                      course.url.split("://")[1].split(".")[0]
                    }.webp`,
                    alt: "Website Link",
                    classList: ["course-image"],
                  }
            )
          );

          link.appendChild(img);
          linkContainer.appendChild(link);
        }

        if (course.review) {
          const reviewUrls = Array.isArray(course.review) ? course.review : [course.review];
        
          for (const reviewUrl of reviewUrls) {
            let [link, img] = ["a", "img"].map((tag) =>
              Object.assign(
                document.createElement(tag),
                tag === "a"
                  ? {
                      href: `https://forms.gle/${reviewUrl}`,
                      target: "_blank",
                    }
                  : {
                      src: "/assets/review.webp",
                      alt: "Review Icon",
                      classList: ["course-image"],
                    }
              )
            );
        
            link.appendChild(img);
            linkContainer.appendChild(link);
          }
        }

        courseContainer.appendChild(title);
        courseContainer.appendChild(code);
        courseContainer.appendChild(professorContainer);
        courseContainer.appendChild(intro);

        if (course.recommended_books && course.recommended_books.length > 0) {
          const booksTitle = Object.assign(document.createElement("h6"), {
            textContent: "Προτεινόμενα συγγράμματα:",
          });

          const booksList = Object.assign(document.createElement("ol"), {
            classList: "books-list",
          });

          // Iterate over the recommended books
          course.recommended_books.forEach((book) => {
            const bookItem = Object.assign(document.createElement("li"), {});

            const bookLink = Object.assign(document.createElement("a"), {
              href: `https://service.eudoxus.gr/search/#a/id:${book.id}/0`,
              target: "_blank",
              textContent: `${book.title}`,
            });

            const bookAuthor = Object.assign(document.createElement("span"), {
              classList: "book-author",
              textContent: `, ${book.author}`,
            });

            bookItem.appendChild(bookLink);
            bookItem.appendChild(bookAuthor);
            booksList.appendChild(bookItem);
          });

          courseContainer.appendChild(booksTitle);
          courseContainer.appendChild(booksList);
        }

        courseContainer.appendChild(linkContainer);

        semesterContainer.appendChild(courseContainer);
      }

      coursesContainer.appendChild(semesterContainer);
    }

    semesterBtns.forEach((semesterBtn) => {
      semesterBtn.addEventListener("click", function () {
        const isActive = this.classList.contains("active");
        semesterBtns.forEach((btn) => {
          btn.classList.remove("active");
        });
        if (isActive) {
          const allCourses = document.querySelectorAll(".course");
          allCourses.forEach((course) => {
            course.classList.remove("active");
          });
        } else {
          this.classList.add("active");
          const allCourses = document.querySelectorAll(".course");
          allCourses.forEach((course) => {
            course.classList.remove("active");
          });
          const semester = this.getAttribute("data-semester");
          const semesterCourses = document.querySelectorAll(
            "#" + semester + " .course"
          );
          semesterCourses.forEach((course) => {
            course.classList.add("active");
          });
        }
      });
    });

    const semesterSelect = document.getElementById("semester-select");
    const allCourses = document.querySelectorAll(".course");

    semesterSelect.addEventListener("change", function () {
      const selectedSemester = this.value;

      // Remove active class from all courses
      allCourses.forEach(function (course) {
        course.classList.remove("active");
      });

      // Add active class to courses of the selected semester
      const semesterCourses = document.querySelectorAll(
        "#" + selectedSemester + " .course"
      );
      semesterCourses.forEach(function (course) {
        course.classList.add("active");
      });
    });

    specializationBtns.forEach((specializationBtn) => {
      specializationBtn.addEventListener("click", function () {
        const isActive = this.classList.contains("active");
        specializationBtns.forEach((btn) => {
          btn.classList.remove("active");
        });
        if (isActive) {
          const defaultButton = document.querySelector(".specialization-btn");
          filterCoursesByCode(defaultButton);
        } else {
          filterCoursesByCode(this);
        }
      });
    });
  })
  .catch((error) => {
    console.error("Error loading JSON data:", error);
  });

// Scroll-Up Button
const scrollToTopBtn = document.getElementById("scroll-to-top-btn");

window.addEventListener("scroll", () => {
  if (window.pageYOffset > 100) {
    scrollToTopBtn.classList.add("show");
  } else {
    scrollToTopBtn.classList.remove("show");
  }
});

scrollToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// Filter
function filterCoursesByCode(button) {
  button.classList.add("active");
  const courses = document.querySelectorAll(".semester .course");
  const specialization = button.getAttribute("data-specialization");
  courses.forEach((course) => {
    const code = course.querySelector("h6").textContent.toUpperCase();
    if (
      (specialization === "CS" && !code.startsWith("I")) ||
      (specialization === "IS" && !code.startsWith("C")) ||
      specialization === "ALL"
    ) {
      course.classList.remove("hidden");
    } else {
      course.classList.add("hidden");
    }
  });
}
