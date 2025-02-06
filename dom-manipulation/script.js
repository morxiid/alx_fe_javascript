const quotes = JSON.parse(localStorage.getItem('quotes')) || [];
const quoteDisplay = document.getElementById('quoteDisplay');
const categoryFilter = document.getElementById('categoryFilter');
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts';

// Fetch and Sync Data with Server
async function fetchQuotesFromServer() {
    try {
        const response = await fetch(SERVER_URL);
        if (!response.ok) throw new Error('Network response was not ok');
        const serverQuotes = await response.json();
        syncQuotes(serverQuotes); // Use syncQuotes to handle merging
    } catch (error) {
        console.error('Error fetching quotes from server:', error);
        notifyUser('Failed to fetch quotes from server.');
    }
}

// Sync Quotes Function
function syncQuotes(serverQuotes) {
    const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];
    const mergedQuotes = [...new Map([...localQuotes, ...serverQuotes].map(q => [q.text, q])).values()];
    localStorage.setItem('quotes', JSON.stringify(mergedQuotes));
    quotes.length = 0; // Clear existing quotes
    quotes.push(...mergedQuotes); // Update quotes array
    displayRandomQuote();
    populateCategories();
    notifyUser('Quotes synced with server!'); // Add notification for successful sync
}

// Display Random Quote
function displayRandomQuote() {
    if (quotes.length === 0) {
        quoteDisplay.textContent = 'No quotes available';
        return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    quoteDisplay.textContent = quotes[randomIndex].text;
    sessionStorage.setItem('lastViewedQuote', quotes[randomIndex].text);
}

document.getElementById('newQuote').addEventListener('click', displayRandomQuote);

// Add New Quote
async function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value.trim();
    const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();
    if (newQuoteText && newQuoteCategory) {
        const newQuote = { text: newQuoteText, category: newQuoteCategory };
        quotes.push(newQuote);
        localStorage.setItem('quotes', JSON.stringify(quotes));
        populateCategories();
        displayRandomQuote();
        await postQuoteToServer(newQuote);
    } else {
        alert('Please enter both quote text and category.');
    }
}

document.getElementById('addQuoteButton').addEventListener('click', addQuote);

// Post Quote to Server
async function postQuoteToServer(quote) {
    try {
        const response = await fetch(SERVER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(quote),
        });
        if (!response.ok) throw new Error('Network response was not ok');
        notifyUser('Quote posted to server successfully.');
    } catch (error) {
        console.error('Error posting quote to server:', error);
        notifyUser('Failed to post quote to server.');
    }
}

// Populate Category Dropdown
function populateCategories() {
    const categories = [...new Set(quotes.map(q => q.category))];
    categoryFilter.innerHTML = '<option value="all">All Categories</option>' + categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
}

// Filter Quotes by Category
function filterQuotes() {
    const selectedCategory = categoryFilter.value;
    const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(q => q.category === selectedCategory);
    quoteDisplay.textContent = filteredQuotes.length > 0 ? filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)].text : 'No quotes available in this category';
    localStorage.setItem('lastSelectedCategory', selectedCategory);
}

categoryFilter.addEventListener('change', filterQuotes);

// Import Quotes from JSON File
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        try {
            const importedQuotes = JSON.parse(event.target.result);
            if (Array.isArray(importedQuotes)) {
                quotes.push(...importedQuotes);
                localStorage.setItem('quotes', JSON.stringify(quotes));
                populateCategories();
                notifyUser('Quotes imported successfully!');
            } else {
                alert('Invalid JSON format. Please ensure the file contains an array of quotes.');
            }
        } catch (error) {
            alert('Error parsing JSON file. Please check the file format.');
        }
    };
    fileReader.readAsText(event.target.files[0]);
}

document.getElementById('importFile').addEventListener('change', importFromJsonFile);

// Export Quotes to JSON File
function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
    URL.revokeObjectURL(url);
}

document.getElementById('exportButton').addEventListener('click', exportToJsonFile);

// Notify User
function notifyUser(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = 'lightgreen';
    notification.style.padding = '10px';
    notification.style.borderRadius = '5px';
    document.body.appendChild(notification);
    setTimeout(() => document.body.removeChild(notification), 3000);
}

// Periodically Check for New Quotes
setInterval(fetchQuotesFromServer, 60000); // Check every 60 seconds

// Initialize Application
window.addEventListener('load', () => {
    populateCategories();
    displayRandomQuote();
    fetchQuotesFromServer();
});