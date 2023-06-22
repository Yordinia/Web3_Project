// Initialize web3
const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');

// Set the contract address and ABI
const contractAddress = '0x123abc...'; // Replace with the actual contract address
const contractABI = [...]; // Replace with the actual contract ABI

// Create a contract instance
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Function to render an artwork
function renderArtwork(artworkId, title, description, imageUrl, price, owner, isForSale) {
    const artworkDiv = document.createElement('div');
    artworkDiv.className = 'artwork';

    const image = document.createElement('img');
    image.src = imageUrl;
    artworkDiv.appendChild(image);

    const artworkInfo = document.createElement('div');
    artworkInfo.className = 'artwork-info';

    const titleElement = document.createElement('h2');
    titleElement.textContent = title;
    artworkInfo.appendChild(titleElement);

    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = description;
    artworkInfo.appendChild(descriptionElement);

    const priceElement = document.createElement('p');
    priceElement.textContent = 'Price: ' + price + ' ETH';
    artworkInfo.appendChild(priceElement);

    const ownerElement = document.createElement('p');
    ownerElement.textContent = 'Owner: ' + owner;
    artworkInfo.appendChild(ownerElement);

    const buyButton = document.createElement('button');
    buyButton.textContent = 'Buy';
    buyButton.disabled = !isForSale;
    buyButton.addEventListener('click', function () {
        buyArtwork(artworkId, price);
    });
    artworkInfo.appendChild(buyButton);

    artworkDiv.appendChild(artworkInfo);

    return artworkDiv;
}

// Function to fetch and render artworks from the API
async function fetchArtworks() {
    try {
        const response = await fetch('https://api.example.com/artworks');
        const artworks = await response.json();

        const artworksDiv = document.getElementById('artworks');
        artworksDiv.innerHTML = '';

        artworks.forEach(function (artwork) {
            const artworkDiv = renderArtwork(
                artwork.id,
                artwork.title,
                artwork.description,
                artwork.imageUrl,
                artwork.price,
                artwork.owner,
                artwork.isForSale
            );
            artworksDiv.appendChild(artworkDiv);
        });

        document.getElementById('message').textContent = '';
    } catch (error) {
        console.error('Error fetching artworks:', error);
        document.getElementById('message').textContent = 'Error fetching artworks. Please try again later.';
    }
}

// Function to handle the purchase of an artwork
async function buyArtwork(artworkId, price) {
    try {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];

        const transaction = await contract.methods.buyArtwork(artworkId).send({ from: account, value: price });
        console.log('Artwork purchased:', transaction.events.ArtworkPurchased.returnValues);

        document.getElementById('message').textContent = 'Artwork purchased successfully.';
    } catch (error) {
        console.error('Error purchasing artwork:', error);
        document.getElementById('message').textContent = 'Error purchasing artwork. Please try again.';
    }
}

// Call the fetchArtworks function to initially fetch and render the artworks
fetchArtworks();