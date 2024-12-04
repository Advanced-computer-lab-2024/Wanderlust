const axios = require('axios');
const NodeCache = require('node-cache');
const Tourist = require('../Models/Tourist');

const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

const getExchangeRates = async (baseCurrency = 'EGP') => {
  const cacheKey = `exchangeRates_${baseCurrency}`;
  const cachedRates = cache.get(cacheKey);

  if (cachedRates) {
    return cachedRates;
  }
// use this link if rates stop working https://v6.exchangerate-api.com/v6/904e1318386f09b81d4d8243/latest/
  try {
    const response = await axios.get(`https://v6.exchangerate-api.com/v6/ef913d22fd0933761082c1eb/latest/${baseCurrency}`);
    if (response.status !== 200) {
      throw new Error(`Failed to fetch exchange rates: ${response.statusText}`);
    }
    const rates = response.data.conversion_rates;
    cache.set(cacheKey, rates);
    return rates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error.message);
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