document.addEventListener('DOMContentLoaded', function () {
    const links = document.querySelectorAll('.navbar .links a');
    const animation = document.querySelector('.navbar .animation');
    const initialLink = document.querySelector('.navbar .links a.select');

    function positionAnimation(element) {
        const linkRect = element.getBoundingClientRect();
        const navbarRect = animation.parentElement.getBoundingClientRect();
        animation.style.left = `${linkRect.left - navbarRect.left}px`;
        animation.style.width = `${linkRect.width}px`;
        animation.style.height = `${linkRect.height}px`;
        animation.style.top = `${linkRect.top - navbarRect.top}px`;
    }

    if (initialLink) {
        positionAnimation(initialLink);
    }

    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            positionAnimation(link);
        });
        link.addEventListener('mouseleave', () => {
            if (initialLink) {
                positionAnimation(initialLink);
            }
        });
    });
});
document.addEventListener('DOMContentLoaded', function () {
    const links = document.querySelectorAll('.navbar .links a');
    const animation = document.querySelector('.navbar .animation-about');
    const initialLink = document.querySelector('.navbar .links a.about-link');

    function positionAnimation(element) {
        const linkRect = element.getBoundingClientRect();
        const navbarRect = animation.parentElement.getBoundingClientRect();
        animation.style.left = `${linkRect.left - navbarRect.left}px`;
        animation.style.width = `${linkRect.width}px`;
        animation.style.height = `${linkRect.height}px`;
        animation.style.top = `${linkRect.top - navbarRect.top}px`;
    }

    if (initialLink) {
        positionAnimation(initialLink);
    }

    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            positionAnimation(link);
        });
        link.addEventListener('mouseleave', () => {
            if (initialLink) {
                positionAnimation(initialLink);
            }
        });
    });
});
document.addEventListener('DOMContentLoaded', function () {
    const links = document.querySelectorAll('.navbar .links a');
    const animation = document.querySelector('.navbar .animation-blogs');
    const initialLink = document.querySelector('.navbar .links a.blogs-link');

    function positionAnimation(element) {
        const linkRect = element.getBoundingClientRect();
        const navbarRect = animation.parentElement.getBoundingClientRect();
        animation.style.left = `${linkRect.left - navbarRect.left}px`;
        animation.style.width = `${linkRect.width}px`;
        animation.style.height = `${linkRect.height}px`;
        animation.style.top = `${linkRect.top - navbarRect.top}px`;
    }

    if (initialLink) {
        positionAnimation(initialLink);
    }

    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            positionAnimation(link);
        });
        link.addEventListener('mouseleave', () => {
            if (initialLink) {
                positionAnimation(initialLink);
            }
        });
    });
});
document.addEventListener('DOMContentLoaded', function () {
    const links = document.querySelectorAll('.navbar .links a');
    const animation = document.querySelector('.navbar .animation-authors');
    const initialLink = document.querySelector('.navbar .links a.authors-link');

    function positionAnimation(element) {
        const linkRect = element.getBoundingClientRect();
        const navbarRect = animation.parentElement.getBoundingClientRect();
        animation.style.left = `${linkRect.left - navbarRect.left}px`;
        animation.style.width = `${linkRect.width}px`;
        animation.style.height = `${linkRect.height}px`;
        animation.style.top = `${linkRect.top - navbarRect.top}px`;
    }

    if (initialLink) {
        positionAnimation(initialLink);
    }

    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            positionAnimation(link);
        });
        link.addEventListener('mouseleave', () => {
            if (initialLink) {
                positionAnimation(initialLink);
            }
        });
    });
});
