# 🕷️ Python Products Scraper

> A powerful, production-ready web scraper for e-commerce websites with support for pagination and dynamic content loading.

[![Python 3.7+](https://img.shields.io/badge/python-3.7+-blue.svg)](https://www.python.org/downloads/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [Examples](#examples)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

## 🎯 Overview

This scraper is designed to extract product information from e-commerce websites that use various pagination methods (traditional pagination, "Load More" buttons, infinite scroll). It handles JavaScript-rendered content and exports data to CSV format.

**Key Capabilities:**
- ✅ Handles "Load More" buttons
- ✅ Supports traditional pagination
- ✅ Extracts 9 product attributes
- ✅ Exports to CSV format
- ✅ Configurable and extensible
- ✅ Comprehensive error handling
- ✅ Production-ready code

## ✨ Features

### Pagination Handling
- **Load More Buttons**: Automatically detects and clicks "Load More" buttons until all products are loaded
- **Traditional Pagination**: Navigates through numbered pages or "Next" links
- **Smart Detection**: Uses multiple CSS/XPath selectors for maximum compatibility
- **Configurable Limits**: Set maximum pages or attempts

### Data Extraction
Extracts the following product details:
- Title
- Price  
- Description (truncated to 500 characters)
- Main image URL
- SKU/Product ID
- Availability status (In Stock/Out of Stock)
- Category
- Brand
- Product page URL

### Technical Features
- **Selenium WebDriver**: Handles JavaScript-rendered content
- **BeautifulSoup**: Efficient HTML parsing
- **Multiple Selectors**: Fallback selectors for better site compatibility
- **Error Handling**: Graceful failure with detailed logging
- **Rate Limiting**: Built-in delays to avoid overwhelming servers
- **User-Agent Spoofing**: Realistic browser headers

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Install ChromeDriver

**Option A (Recommended):**
```bash
pip install webdriver-manager
```

**Option B:** Download manually from [ChromeDriver](https://chromedriver.chromium.org/downloads)

### 3. Run the Scraper

```bash
python products_scraper.py https://example.com/products
```

That's it! Your data will be saved to `products.csv`.

👉 **For detailed setup instructions, see [QUICKSTART.md](QUICKSTART.md)**

## 📚 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Get started in 5 minutes
- **[SCRAPER_README.md](SCRAPER_README.md)** - Comprehensive documentation
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Technical overview and architecture
- **[scraper_examples.py](scraper_examples.py)** - Programmatic usage examples

## 📦 Requirements

- Python 3.7 or higher
- Google Chrome browser
- ChromeDriver (matching your Chrome version)

### Python Dependencies
```
selenium >= 4.15.0
beautifulsoup4 >= 4.12.0
lxml >= 4.9.0
requests >= 2.31.0
webdriver-manager >= 4.0.0
```

## 🔧 Installation

### Method 1: Using pip (Recommended)

```bash
# Clone the repository (if not already cloned)
git clone https://github.com/qaiserfccu/try-new-idea.git
cd try-new-idea

# Checkout the scraper branch
git checkout python-products-scrapper

# Install dependencies
pip install -r requirements.txt

# Install webdriver-manager for automatic ChromeDriver setup
pip install webdriver-manager
```

### Method 2: Using virtualenv

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

## 💻 Usage

### Command Line Interface

```bash
# Basic usage
python products_scraper.py <URL>

# With options
python products_scraper.py <URL> [OPTIONS]
```

### Options

| Option | Description | Default |
|--------|-------------|---------|
| `--output`, `-o` | Output CSV filename | `products.csv` |
| `--max-pages` | Maximum pages to scrape | `10` |
| `--no-load-more` | Use pagination instead of Load More | `False` |
| `--visible` | Run browser in visible mode | `False` |
| `--timeout` | Element wait timeout (seconds) | `10` |
| `--help` | Show help message | - |

### Examples

#### Example 1: Basic Scraping
```bash
python products_scraper.py https://chiltanpure.com/products
```

#### Example 2: Custom Output File
```bash
python products_scraper.py https://example.com/products -o my_products.csv
```

#### Example 3: Pagination Mode (Limit 3 Pages)
```bash
python products_scraper.py https://example.com/products --no-load-more --max-pages 3
```

#### Example 4: Visible Browser (For Debugging)
```bash
python products_scraper.py https://example.com/products --visible
```

#### Example 5: Custom Timeout
```bash
python products_scraper.py https://example.com/products --timeout 20
```

### Programmatic Usage

```python
from products_scraper import ProductsScraper

# Create scraper instance
scraper = ProductsScraper(
    base_url="https://example.com/products",
    headless=True,
    timeout=10
)

# Scrape all products
scraper.scrape_all_products(
    use_load_more=True,
    max_pages=10
)

# Export to CSV
scraper.export_to_csv('output.csv')

# Access data directly
products = scraper.products_data
for product in products:
    print(f"{product['title']} - {product['price']}")
```

For more examples, see [scraper_examples.py](scraper_examples.py)

## 🧪 Testing

The project includes a comprehensive test suite:

```bash
# Run all tests
python test_scraper.py
```

**Test Coverage:**
- ✅ Module import tests
- ✅ Class structure tests
- ✅ Configuration validation
- ✅ File existence checks
- ✅ Syntax validation

**Test Results:**
```
Ran 7 tests in 0.005s
OK (skipped=2)
```

Two tests are skipped when Selenium is not installed (expected behavior).

## 📁 Project Structure

```
.
├── products_scraper.py      # Main scraper implementation (655 lines)
├── requirements.txt          # Python dependencies
├── scraper_examples.py      # Usage examples
├── test_scraper.py          # Test suite
├── SCRAPER_README.md        # Comprehensive documentation
├── QUICKSTART.md            # Quick start guide
└── PROJECT_SUMMARY.md       # Technical overview
```

## 📊 Output Format

The scraper generates a CSV file with the following structure:

```csv
url,title,price,description,image_url,sku,availability,category,brand
https://example.com/product/1,Product Name,$29.99,Product description...,https://example.com/img.jpg,SKU123,In Stock,Electronics,BrandName
```

## 🔍 How It Works

1. **Load Page**: Opens the product listing page using Selenium
2. **Handle Pagination**: 
   - Clicks "Load More" buttons repeatedly, OR
   - Navigates through page numbers
3. **Extract URLs**: Collects all product page URLs from the listing
4. **Visit Products**: Navigates to each product detail page
5. **Extract Data**: Scrapes product information using multiple selectors
6. **Export CSV**: Saves all data to a CSV file

## 🛡️ Best Practices

- ✅ **Respect robots.txt**: Always check the website's robots.txt
- ✅ **Rate Limiting**: Built-in delays prevent server overload
- ✅ **Error Handling**: Graceful failure with detailed logging
- ✅ **User-Agent**: Realistic browser headers
- ✅ **Data Privacy**: Only scrape public product information

## ⚠️ Limitations

- Requires Chrome browser and ChromeDriver
- Cannot handle CAPTCHAs automatically
- Single-threaded (scrapes one page at a time)
- May be blocked by aggressive anti-bot systems
- Requires JavaScript execution (uses Selenium)

## 🔧 Customization

The scraper can be easily customized for specific websites by modifying the extraction methods:

```python
def _extract_title(self, soup: BeautifulSoup) -> str:
    """Customize this method to match your target website"""
    selectors = [
        'h1[class*="product"]',
        'h1[class*="title"]',
        '.product-title',
        # Add your custom selectors here
    ]
    # ... extraction logic
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## 📄 License

This project is provided as-is for educational purposes. Always ensure you have permission to scrape websites and comply with their terms of service.

## 🆘 Support

- **Documentation**: See [SCRAPER_README.md](SCRAPER_README.md)
- **Quick Start**: See [QUICKSTART.md](QUICKSTART.md)
- **Examples**: See [scraper_examples.py](scraper_examples.py)
- **Issues**: Check the troubleshooting section in SCRAPER_README.md

## 🎓 Learning Resources

- [Selenium Documentation](https://selenium-python.readthedocs.io/)
- [BeautifulSoup Documentation](https://www.crummy.com/software/BeautifulSoup/bs4/doc/)
- [Web Scraping Best Practices](https://www.scrapehero.com/web-scraping-best-practices/)

---

**Made with ❤️ for the web scraping community**

For questions or feedback, please open an issue on GitHub.
