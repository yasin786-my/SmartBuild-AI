"""
currency.py — Multi-currency conversion with rates relative to INR.
Supports INR, USD, EUR, GBP.  Rates are mock / approximate.
"""

# Exchange rates: 1 INR = X target currency
EXCHANGE_RATES = {
    "INR": 1.0,
    "USD": 0.012,
    "EUR": 0.011,
    "GBP": 0.0095,
}

CURRENCY_SYMBOLS = {
    "INR": "₹",
    "USD": "$",
    "EUR": "€",
    "GBP": "£",
}

CURRENCY_LOCALES = {
    "INR": "en-IN",
    "USD": "en-US",
    "EUR": "de-DE",
    "GBP": "en-GB",
}


def convert_price(price_inr: float, target_currency: str = "INR") -> float:
    """Convert a price from INR to the target currency."""
    rate = EXCHANGE_RATES.get(target_currency.upper(), 1.0)
    return round(price_inr * rate, 2)


def get_supported_currencies() -> list[dict]:
    """Return list of supported currencies with their symbols and rates."""
    return [
        {
            "code": code,
            "symbol": CURRENCY_SYMBOLS[code],
            "rate_from_inr": rate,
            "locale": CURRENCY_LOCALES[code],
        }
        for code, rate in EXCHANGE_RATES.items()
    ]
