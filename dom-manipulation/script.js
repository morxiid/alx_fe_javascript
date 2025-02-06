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
    const newQuoteText = document.getElementById("newQuoteText").value.trim();
    const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();
    const quoteDisplay = document.getElementById("quoteDisplay");
    
    if (newQuoteText === "" || newQuoteCategory === "") {
        alert("Please enter both a quote and a category.");
        return;
    }
    
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    
    alert("Quote added successfully!");
    
    // Update the displayed quote with the new quote added
    quoteDisplay.innerHTML = `<p><strong>${newQuoteCategory}:</strong> "${newQuoteText}"</p>`;
}
