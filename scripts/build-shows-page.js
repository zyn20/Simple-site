document.addEventListener('DOMContentLoaded', () => {
    const showsList = document.getElementById('shows-list');
    const apiKey = '43c2968e-a9ef-4b40-ad03-146f3c453b26'; // Replace with your actual API key

    axios.get(`https://project-1-api.herokuapp.com/showdates?api_key=${apiKey}`)
        .then(response => {
            const shows = response.data;
            renderShows(shows);
        })
        .catch(error => console.error('Error fetching shows:', error));

    function renderShows(shows) {
        showsList.innerHTML = '';
        shows.forEach(show => {
            const showElement = createShowElement(show);
            showsList.appendChild(showElement);
        });
    }

    function createShowElement(show) {
        const showElement = document.createElement('div');
        showElement.classList.add('show');

        const showDate = document.createElement('div');
        showDate.classList.add('show-date');
        showDate.textContent = new Date(show.date).toDateString();
        showElement.appendChild(showDate);

        const showVenue = document.createElement('div');
        showVenue.classList.add('show-venue');
        showVenue.textContent = show.place;
        showElement.appendChild(showVenue);

        const showLocation = document.createElement('div');
        showLocation.classList.add('show-location');
        showLocation.textContent = show.location;
        showElement.appendChild(showLocation);

        const buyButton = document.createElement('button');
        buyButton.classList.add('show-button');
        buyButton.textContent = 'BUY TICKETS';
        showElement.appendChild(buyButton);

        // Click event for selecting a show
        showElement.addEventListener('click', () => {
            const currentlySelected = document.querySelector('.show--selected');
            if (currentlySelected) {
                currentlySelected.classList.remove('show--selected');
            }
            showElement.classList.add('show--selected');
        });

        return showElement;
    }
});
