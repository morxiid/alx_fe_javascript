// Dynamic Quote Generator with Web Storage, JSON Handling, Filtering, and Server Sync

const quotes = JSON.parse(localStorage.getItem('quotes')) || [];
const quoteDisplay = document.getElementById('quoteDisplay');
const categoryFilter = document.getElementById('categoryFilter');
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts';

// Fetch and Sync Data with Server
async function fetchQuotesFromServer() {
    try {
        const response = await fetch(SERVER_URL);
        const serverQuotes = await response.json();
        mergeQuotes(serverQuotes);
    } catch (error) {
        console.error('Error fetching quotes from server:', error);
    }
}

function mergeQuotes(serverQuotes) {
    const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];
    const mergedQuotes = [...new Map([...localQuotes, ...serverQuotes].map(q => [q.text, q])).values()];
    localStorage.setItem('quotes', JSON.stringify(mergedQuotes));
    displayRandomQuote();
}

// Display Random Quote
function displayRandomQuote() {
    if (quotes.length === 0) return;
    const randomIndex = Math.floor(Math.random() * quotes.length);
    quoteDisplay.textContent = quotes[randomIndex].text;
    sessionStorage.setItem('lastViewedQuote', quotes[randomIndex].text);
}

document.getElementById('newQuote').addEventListener('click', displayRandomQuote);

// Add New Quote
function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;
    if (newQuoteText && newQuoteCategory) {
        const newQuote = { text: newQuoteText, category: newQuoteCategory };
        quotes.push(newQuote);
        localStorage.setItem('quotes', JSON.stringify(quotes));
        populateCategories();
        displayRandomQuote();
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
    quoteDisplay.textContent = filteredQuotes.length > 0 ? filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)].text : 'No quotes available';
    localStorage.setItem('lastSelectedCategory', selectedCategory);
}

categoryFilter.addEventListener('change', filterQuotes);

// Import Quotes from JSON File
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        localStorage.setItem('quotes', JSON.stringify(quotes));
        populateCategories();
        alert('Quotes imported successfully!');
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

// Initialize Application
window.addEventListener('load', () => {
    populateCategories();
    displayRandomQuote();
    fetchQuotesFromServer();
});