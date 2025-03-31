//array of objects
let quotes = [
    { text: "if you can make a dollar your ideot",
        category: "Business"
    },
    { text: "take the risk or lose the chance",
        category: "Business"
    },
    { text: "So fucking weak",
        category: "Faillure"
    }
];

const createAddQuoteForm(){
    const name = createElement();
    const namee = appendChild();
};

// fun to display a random quotes
function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    quoteDisplay.innerHTML = `<strong>${randomQuote.text}</strong>
                            <em>(${randomQuote.category})</em>`
};


//fun to add a new quote
function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;

    if(newQuoteText && newQuoteCategory){
        quotes.push({text: newQuoteText, category: newQuoteCategory});
        //clear the inputs fields
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        showRandomQuote();
    }else{
        alert('please enter the quote and category fields')
    }
}

//add event listener
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

showRandomQuote();
