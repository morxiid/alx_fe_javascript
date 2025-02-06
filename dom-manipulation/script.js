const quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Injustice anywhere is a threat to justice everywhere.", category: "Justice" },
    { text: "Education is the most powerful weapon which you can use to change the world.", category: "Education" }
];

// Function to save quotes to local storage
function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Function to display a random quote
function showRandomQuote() {
    const quoteDisplay = document.getElementById("quoteDisplay");
    if (quotes.length === 0) {
        quoteDisplay.innerHTML = "No quotes available.";
        return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const selectedQuote = quotes[randomIndex];
    quoteDisplay.innerHTML = `<p><strong>${selectedQuote.category}:</strong> "${selectedQuote.text}"</p>`;
    sessionStorage.setItem("lastViewedQuote", JSON.stringify(selectedQuote));
}

document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Function to create the quote addition form dynamically
function createAddQuoteForm() {
    const formContainer = document.createElement("div");
    
    document.body.appendChild(formContainer);
    document.getElementById("addQuoteButton").addEventListener("click", addQuote);
    document.getElementById("exportButton").addEventListener("click", exportToJsonFile);
    populateCategories();
}

// Function to add a new quote
function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText");
    const newQuoteCategory = document.getElementById("newQuoteCategory");
    const quoteDisplay = document.getElementById("quoteDisplay");
    
    if (!newQuoteText || !newQuoteCategory) {
        console.error("Input fields not found.");
        return;
    }
    
    const text = newQuoteText.value.trim();
    const category = newQuoteCategory.value.trim();
    
    if (text === "" || category === "") {
        alert("Please enter both a quote and a category.");
        return;
    }
    
    const newQuote = { text, category };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    
    newQuoteText.value = "";
    newQuoteCategory.value = "";
    
    alert("Quote added successfully!");
    
    // Update the DOM with the newly added quote
    quoteDisplay.innerHTML = `<p><strong>${newQuote.category}:</strong> "${newQuote.text}"</p>`;
}

// Function to export quotes as JSON file
function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Function to import quotes from JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        try {
            const importedQuotes = JSON.parse(event.target.result);
            if (Array.isArray(importedQuotes)) {
                quotes.push(...importedQuotes);
                saveQuotes();
                populateCategories();
                alert("Quotes imported successfully!");
            } else {
                alert("Invalid file format.");
            }
        } catch (error) {
            alert("Error parsing JSON file.");
        }
    };
    fileReader.readAsText(event.target.files[0]);
}

// Populate categories dynamically
function populateCategories() {
    const categoryFilter = document.getElementById("categoryFilter");
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    const uniqueCategories = [...new Set(quotes.map(q => q.category))];
    uniqueCategories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Function to filter quotes based on selected category
function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    localStorage.setItem("selectedCategory", selectedCategory);
    const filteredQuotes = selectedCategory === "all" ? quotes : quotes.filter(q => q.category === selectedCategory);
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = filteredQuotes.map(q => `<p><strong>${q.category}:</strong> "${q.text}"</p>`).join("\n");
}

// Load last selected category filter
function loadLastSelectedFilter() {
    const selectedCategory = localStorage.getItem("selectedCategory") || "all";
    document.getElementById("categoryFilter").value = selectedCategory;
    filterQuotes();
}

// Initialize the form creation and load last viewed quote when the page loads
document.addEventListener("DOMContentLoaded", () => {
    createAddQuoteForm();
    loadLastSelectedFilter();
    loadLastViewedQuote();
});