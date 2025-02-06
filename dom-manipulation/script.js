const quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Injustice anywhere is a threat to justice everywhere.", category: "Justice" },
    { text: "Education is the most powerful weapon which you can use to change the world.", category: "Education" }
];

// Function to display a random quote
function showRandomQuote() {
    const quoteDisplay = document.getElementById("quoteDisplay");
    if (quotes.length === 0) {
        quoteDisplay.innerHTML = "No quotes available.";
        return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    quoteDisplay.innerHTML = `<p><strong>${quotes[randomIndex].category}:</strong> "${quotes[randomIndex].text}"</p>`;
}

document.getElementById("newQuote").addEventListener("click", showRandomQuote);

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
    
    newQuoteText.value = "";
    newQuoteCategory.value = "";
    
    alert("Quote added successfully!");
    
    // Update the DOM with the newly added quote
    quoteDisplay.innerHTML = `<p><strong>${newQuote.category}:</strong> "${newQuote.text}"</p>`;
}

// Ensure the addQuote function is bound to the correct button
document.getElementById("addQuoteButton").addEventListener("click", addQuote);