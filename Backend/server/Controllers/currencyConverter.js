const axios = require('axios');
const Tourist = require('../Models/Tourist');

const getExchangeRates = async (baseCurrency = 'EGP') => {
  try {
    const response = await axios.get(`https://v6.exchangerate-api.com/v6/24854109d0f837a5bd8882e3/latest/${baseCurrency}`);
    return response.data.conversion_rates;
  } catch (error) {
    throw new Error('Failed to fetch exchange rates');
  }
};

const convertCurrency = async (amount, targetCurrency, touristId, baseCurrency = null) => {
  let finalBaseCurrency = baseCurrency || 'EGP'; // Default to EGP if no baseCurrency is provided

  if (!baseCurrency && touristId) {
    const tourist = await Tourist.findById(touristId);
    finalBaseCurrency = tourist ? tourist.currency : 'EGP'; // Use tourist's preferred currency or default to EGP
  }

  const rates = await getExchangeRates(finalBaseCurrency);
  if (!rates[targetCurrency]) {
    throw new Error(`Currency code ${targetCurrency} not found in exchange rates.`);
  }
  const conversionRate = rates[targetCurrency];
  return (amount * conversionRate).toFixed(2);
};


module.exports = { getExchangeRates, convertCurrency };