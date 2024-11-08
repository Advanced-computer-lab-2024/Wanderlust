const axios = require('axios');

const getExchangeRates = async (baseCurrency = 'EGP') => {
  try {
    const response = await axios.get(`https://v6.exchangerate-api.com/v6/77676a6e9ec92dc31f556a19/latest/${baseCurrency}`);
    return response.data.conversion_rates;
  } catch (error) {
    throw new Error('Failed to fetch exchange rates');
  }
};

const convertCurrency = async (amount, targetCurrency, baseCurrency = 'EGP') => {
  const rates = await getExchangeRates(baseCurrency);
  if (!rates[targetCurrency]) {
    throw new Error(`Currency code ${targetCurrency} not found in exchange rates.`);
  }
  const conversionRate = rates[targetCurrency];
  return (amount * conversionRate).toFixed(2);
};

module.exports = { getExchangeRates, convertCurrency };