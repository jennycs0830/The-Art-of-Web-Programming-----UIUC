var linkElement = document.querySelector('a');

linkElement.addEventListener('mouseover', function() {
    linkElement.style.color = 'orange';
});

linkElement.addEventListener('mouseout', function() {
    linkElement.style.color = 'white';
});
