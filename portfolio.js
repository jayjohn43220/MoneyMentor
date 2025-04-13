document.addEventListener('DOMContentLoaded', () => {
  const API_KEY = '0b125d57d2ce4ced9f84aedf8dce8e81'; // Replace with your API key
  const stockForm = document.getElementById('stockForm');
  const portfolioList = document.getElementById('portfolioList');
  const chartCtx = document.getElementById('chartCanvas').getContext('2d');

  let stocks = JSON.parse(localStorage.getItem('stocks')) || [];

  let chart = new Chart(chartCtx, {
    type: 'bar',
    data: {
      labels: [],
      datasets: [{
        label: 'Total Investment ($)',
        data: [],
        backgroundColor: 'rgba(59,130,246,0.6)',
        borderColor: 'rgba(59,130,246,1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  
  function renderStoredData() {
    portfolioList.innerHTML = '';
    chart.data.labels = [];
    chart.data.datasets[0].data = [];

    stocks.forEach(stock => {
      renderStockCard(stock);
      updateChartData(stock);
    });

    chart.update();
  }

 
  function renderStockCard(stock) {
    const card = document.createElement('div');
    card.classList.add('stock-card');
    card.innerHTML = `
      <h2>${stock.symbol}</h2>
      <p>Shares: ${stock.shares}</p>
      <p>Purchase Price: $${stock.purchasePrice.toFixed(2)}</p>
      <p>Total Investment: $${(stock.shares * stock.purchasePrice).toFixed(2)}</p>
      <p id="profitLoss-${stock.symbol}">Loading...</p>

      <button class="delete-button" data-symbol="${stock.symbol}">Delete</button>
    `;
    
    portfolioList.appendChild(card);
    updateStockProfitLoss(stock);

    const deleteButton = card.querySelector('.delete-button');
    deleteButton.addEventListener('click', () => deleteStock(stock.symbol));
  }

function displayGeminiTip(symbol, tip) {
  const tipElement = document.getElementById(`geminiTip-${symbol}`);
  if (tipElement) {
    tipElement.textContent = `AI Tip: ${tip}`;
  }
}

  
  function updateChartData(stock) {
    chart.data.labels.push(stock.symbol);
    chart.data.datasets[0].data.push(stock.shares * stock.purchasePrice);
  }

  
  function saveToLocalStorage() {
    localStorage.setItem('stocks', JSON.stringify(stocks));
  }

  
  async function getStockPrice(symbol) {
    try {
      const response = await fetch(`https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${API_KEY}`);
      const data = await response.json();
  
      if (!data.close) {
        console.error(`Error fetching data for ${symbol}:`, data);
        throw new Error(`Failed to fetch stock data for "${symbol}".`);
      }
  
      return parseFloat(data.close); 
    } catch (error) {
      console.error(`Error fetching stock price for ${symbol}:`, error);
      return null; 
    }
  }
  

  
  async function updateStockProfitLoss(stock) {
    const profitLossElement = document.getElementById(`profitLoss-${stock.symbol}`);
    try {
      let currentPrice = await getStockPrice(stock.symbol);

      if (currentPrice === null) {

        currentPrice = stock.lastKnownPrice;
        if (currentPrice === undefined) {
          profitLossElement.textContent = 'Market Closed';
          return;
        }
      }

      
      stock.lastKnownPrice = currentPrice;
      saveToLocalStorage();

      const profitLoss = (currentPrice - stock.purchasePrice) * stock.shares;
      const status = profitLoss >= 0 ? 'Up' : 'Down';

      profitLossElement.textContent = `${status}: $${profitLoss.toFixed(2)} (${((profitLoss / (stock.purchasePrice * stock.shares)) * 100).toFixed(2)}%)`;
    } catch (error) {
      profitLossElement.textContent = 'Market Closed';
    }
  }

  
  function deleteStock(symbol) {
    stocks = stocks.filter(stock => stock.symbol !== symbol);
    saveToLocalStorage();
    renderStoredData();
  }

  
  stockForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const symbol = document.getElementById('symbol').value.trim().toUpperCase();
    const shares = parseFloat(document.getElementById('shares').value);
    const purchasePrice = parseFloat(document.getElementById('purchasePrice').value);

    if (!symbol || isNaN(shares) || isNaN(purchasePrice)) return;

    const newStock = { symbol, shares, purchasePrice };
    stocks.push(newStock);

    renderStockCard(newStock);
    updateChartData(newStock);
    chart.update();
    saveToLocalStorage();

    stockForm.reset();


  });

  
  renderStoredData();
});
