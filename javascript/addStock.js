// Setting up Stocks Class: Represents a purhcase of a stock
class Stocks {
	constructor(id, typePurchase, ticker, numPurchased, datePurchased, pricePer, fee, stopLimit, stopLimitType, notes, createdDate, updatedDate){
		this.id = id;
		this.typePurchase = typePurchase;
		this.ticker = ticker;
		this.numPurchased = numPurchased;
		this.datePurchased = datePurchased;
		this.pricePer = pricePer;
		this.fee = fee;
		this.stopLimit = stopLimit;
		this.stopLimitType = stopLimitType;
		this.notes = notes;
		this.createdDate = createdDate;
		this.updatedDate = updatedDate
	}
	// Add Methods
	totalPaid() {
		return this.numPurchased*this.pricePer;
	}
};


// UI Class: Handles the UI Tasks
class UI {
	static displayStocks(){
		const myStocks = Store.getStocks();
		/*
		// Dummy stock
		const myStocks = [
		{
			id:1,
			typePurchase: 'Buy',
			ticker: 'AAPL',
			numPurchased: 8,
			datePurchased: '02-13-2020 12:00PM',
			pricePer: 325.13,
			fee: null,
			stopLimit: 8,
			stopLimitType: 'percent',
			notes: 'Getting back into Apple',
			createdDate: '07-15-2020 6:30PM',
			updatedDate: null	
		},
		];

		*/

		myStocks.forEach((stock) => UI.addStockToList(stock));
	} 

	static addStockToList(stock) {
		const stockTable = document.querySelector('#tbl-body');
		
		const row = document.createElement('tr');
		row.innerHTML = `
			<td>${stock.id}</td>
			<td>${stock.typePurchase}</td>
			<td>${stock.numPurchased}</td>
			<td>${stock.ticker}</td>
			<td>$${stock.pricePer}</td>
			<td>${stock.datePurchased}</td>
			<td><a href="#" class="remove-btn">X</a></td>
			`;
		stockTable.appendChild(row);
	}

	static removeStockFromList(el) {
		el.parentElement.parentElement.remove();
	};

};



// Show Stocks when table loads
document.addEventListener('DOMContentLoaded', UI.displayStocks)


// Dummy Stocks
const stock1 = new Stocks(1, 'Buy', 'ZM', 10, '07-13-2020 9:31AM', 266.76, null, 10, 'percent', 'Zoom looks like a good buy in the long run', Date(), null);


//Store Class
class Store {
	// Pull Stocks from storage
	static getStocks() {
		let stocks;
		if(localStorage.getItem('stocks') === null) {
			stocks = [];
		} else {
			stocks = JSON.parse(localStorage.getItem('stocks'));
		};

		return stocks;
	};

	// Add Stock
	static addStock(stock) {
		const stocks = Store.getStocks();
		stocks.push(stock);

		localStorage.setItem('stocks', JSON.stringify(stocks));
	};

	// Remove Stock
	static removeStock(id) {
		const stocks = Store.getStocks();
		stocks.forEach((stock, index) => {
			if(stock.id === id) {
				stocks.splice(index,1);
			}
		});

		localStorage.setItem('stocks', JSON.stringify(stocks));
	};
}




//   JS for adding a stock manually 

const addStockForm = document.querySelector('#add-stock');
const errorMsg = document.querySelector('.stockadd-error-msg')
const buyType = document.querySelector('#buy-type');
const btn = document.querySelector('.btn')

const myTicker = document.querySelector('#ticker');
const amount = document.querySelector('#amount');
const date = document.querySelector('#date');
const price = document.querySelector('#price');

const fee = document.querySelector('#fee');
const stopLimit = document.querySelector('#stop-limit');

// radio buttons
const stopLimitTypePerc = document.querySelector('#percentage-radio');
const stopLimitTypePric = document.querySelector('#price-radio');


const notes = document.querySelector('#notes');

const addedStock = document.querySelector('#stock-list')

// Validation colors
const green = '#4CAF50';
const red = '#F44336';

// Add Stock
addStockForm.addEventListener('submit', function(e){
	e.preventDefault();
	//Add values
	const myTickerValue = myTicker.value.trim();
	const amountValue = amount.value.trim();
	const dateValue = date.value.trim();
	const priceValue = price.value.trim();
	//Check the inputs
	checkInputs();


	if(emptyFields(myTickerValue, amountValue, dateValue, priceValue)){
		// update error message
		console.log('Missing fields');
		errorMsg.innerText = 'All required fields are not entered';
		errorMsg.className = 'stockadd-error-msg error-msg-top';


		
	} else if (invalidFields(myTickerValue, amountValue, dateValue, priceValue)){
		// update error message
		console.log('Validate fields');	
		errorMsg.innerText = 'Please enter valid data for the highlighted fields';
		errorMsg.className = 'stockadd-error-msg error-msg-top';

	} else {
		//const id = Store.getStocks().length+1;

		//Create highest ID
		function maxId() {
			const currentStocks = Store.getStocks();
			let id = 0;
			let max = 1;
			if(currentStocks.length === 0){
				id = 1;
				return id;
			} else {
				for (i=0 ; i < currentStocks.length ; i++) {
					if(currentStocks[i].id >= max) {
						id = Number(currentStocks[i].id) + 1;
					} else {
						id = max;
					};
				};

				return id;
			};
		};

		const stopLimitType = stopLimitTypePerc.checked ? 'percent' : (stopLimitTypePric.checked ? 'price' : null);
		const newStock = new Stocks(maxId(), buyType.value, myTickerValue, parseFloat(amountValue), dateValue, parseFloat(priceValue), parseFloat(fee.value), stopLimit.value, stopLimitType, notes.value, Date(), null);

		UI.addStockToList(newStock);

		Store.addStock(newStock);

		errorMsg.className = 'stockadd-error-msg';

		myTicker.value = '';
		amount.value = '';
		date.value = '';
		price.value = '';
		fee.value = '';
		stopLimit.value = '';
		stopLimitTypePerc.checked = false;
		stopLimitTypePric.checked = false;
		notes.value = '';
	};
});

// Validate Stock 
function checkInputs(){
	//Get values for inputs
	const myTickerValue = myTicker.value.trim();
	const amountValue = amount.value.trim();
	const dateValue = date.value.trim();
	const priceValue = price.value.trim();

	if(myTickerValue === ''){
		// highlight red and show error
		setError(myTicker);
	} else {
		// Remove error class
		unsetError(myTicker)
	};

	if(amountValue === ''){
		// highlight red and show error
		setError(amount);
	} else {
		// Remove error class
		unsetError(amount)
	};

	if(dateValue === ''){
		// highlight red and show error
		setError(date);
	} else {
		// Remove error class
		unsetError(date)
	};

	if(priceValue === ''){
		// highlight red and show error
		setError(price);
	} else {
		// Remove error class
		unsetError(price)
	};

}



function setError(input){
	// Make input box red
	input.className = 'error'
}

function unsetError(input){
	// Make input box gray
	input.className = ''
}


function emptyFields(ticker1, amount1, date1, price1){
	if(ticker1 === '' || 
		amount1 === '' ||
		date1 === ''  ||
		price1 === ''){
		console.log('At least one missing field');
		return true;
	} else {
		return false;
	};
};


function invalidFields(ticker2, amount2, date2, price2){
	if(!typeof ticker2 === 'string' && 
		isNaN(amount2) &&
		!isValidDate(date2) &&
		isNaN(price2) ){
		console.log('At least one invalid field');
		return true;
	} else {
	return false;
	};
};

function isValidDate(date) {
  return date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date);
}

// Event: Remove Stock
document.querySelector('.stock-table').addEventListener('click', (e) => {
	const id = Number(e.target.parentElement.parentElement.firstElementChild.innerText);
	if(e.target.className = 'remove-btn'){
		if(confirm('Are you sure?')){
			UI.removeStockFromList(e.target);

			Store.removeStock(id);
		}

	}
})


// Testing 








