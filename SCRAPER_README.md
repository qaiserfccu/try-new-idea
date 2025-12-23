# Products Scraper

A powerful Python-based web scraper for extracting product information from e-commerce websites. This scraper can handle:

- **Pagination**: Traditional page-by-page navigation
- **Load More Buttons**: Dynamic content loading via "Load More" buttons
- **Product Details**: Comprehensive product information extraction
- **CSV Export**: Organized data export to CSV format

## Features

✅ **Smart Pagination Handling**
- Automatically detects and handles "Load More" buttons
- Supports traditional pagination navigation
- Scrolls to load lazy-loaded content

✅ **Comprehensive Data Extraction**
- Product title
- Price
- Description
- Images
- SKU
- Availability status
- Category
- Brand

✅ **Robust & Reliable**
- Handles dynamic JavaScript-rendered content using Selenium
- Multiple CSS selectors for better compatibility
- Error handling and logging
- Configurable timeouts and limits

✅ **Easy to Use**
- Simple command-line interface
- Configurable output filename
- Headless or visible browser mode
- Progress tracking

## Prerequisites

- Python 3.7 or higher
- Google Chrome browser
- ChromeDriver (compatible with your Chrome version)

## Installation

### 1. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 2. Install ChromeDriver

**Option A: Manual Installation**
1. Check your Chrome version: `chrome://version/`
2. Download matching ChromeDriver from [ChromeDriver Downloads](https://chromedriver.chromium.org/downloads)
3. Add ChromeDriver to your system PATH

**Option B: Automatic Installation (using webdriver-manager)**
```bash
pip install webdriver-manager
```

Then modify the script to use:
```python
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service

service = Service(ChromeDriverManager().install())
self.driver = webdriver.Chrome(service=service, options=chrome_options)
```

## Usage

### Basic Usage

Scrape products from a URL with default settings:

```bash
python products_scraper.py https://example.com/products
```

### Advanced Options

```bash
# Specify output filename
python products_scraper.py https://example.com/products --output my_products.csv

# Use pagination instead of "Load More" button
python products_scraper.py https://example.com/products --no-load-more --max-pages 5

# Run browser in visible mode (for debugging)
python products_scraper.py https://example.com/products --visible

# Set custom timeout
python products_scraper.py https://example.com/products --timeout 15
```

### Command-Line Arguments

| Argument | Description | Default |
|----------|-------------|---------|
| `url` | URL of the products listing page (required) | - |
| `--output`, `-o` | Output CSV filename | `products.csv` |
| `--max-pages` | Maximum number of pages to scrape | `10` |
| `--no-load-more` | Disable "Load More" and use pagination | `False` |
| `--visible` | Run browser in visible mode | `False` |
| `--timeout` | Element wait timeout in seconds | `10` |

## Examples

### Example 1: Scrape with Load More Button

```bash
python products_scraper.py https://chiltanpure.com/products
```

This will:
1. Load the products page
2. Automatically click "Load More" buttons to load all products
3. Extract all product URLs
4. Visit each product page and extract details
5. Save to `products.csv`

### Example 2: Scrape with Traditional Pagination

```bash
python products_scraper.py https://example.com/shop --no-load-more --max-pages 3
```

This will:
1. Scrape products from the first 3 pages
2. Navigate using "Next" page buttons
3. Save results to `products.csv`

### Example 3: Custom Output File

```bash
python products_scraper.py https://example.com/products -o my_data.csv
```

## Output Format

The scraper generates a CSV file with the following columns:

| Column | Description |
|--------|-------------|
| `url` | Product page URL |
| `title` | Product name/title |
| `price` | Product price |
| `description` | Product description (truncated to 500 chars) |
| `image_url` | Main product image URL |
| `sku` | Product SKU/ID |
| `availability` | Stock status (In Stock/Out of Stock) |
| `category` | Product category |
| `brand` | Product brand |

### Sample Output

```csv
url,title,price,description,image_url,sku,availability,category,brand
https://example.com/product/1,Product Name,$29.99,Product description...,https://example.com/img.jpg,SKU123,In Stock,Electronics,BrandName
```

## Customization

### Modifying Extraction Selectors

The scraper uses multiple CSS selectors to find product information. You can customize these in the `ProductsScraper` class methods:

- `_extract_title()`: Product title selectors
- `_extract_price()`: Price selectors
- `_extract_description()`: Description selectors
- `_extract_image()`: Image selectors
- etc.

### Adding Custom Fields

To extract additional fields:

1. Add a new extraction method (e.g., `_extract_rating()`)
2. Call it in the `scrape_product_details()` method
3. Add the field to the product dictionary

Example:

```python
def _extract_rating(self, soup: BeautifulSoup) -> str:
    """Extract product rating"""
    selectors = ['.rating', '[itemprop="ratingValue"]']
    for selector in selectors:
        element = soup.select_one(selector)
        if element:
            return element.get_text(strip=True)
    return "N/A"
```

## Troubleshooting

### ChromeDriver Issues

**Error: "chromedriver executable needs to be in PATH"**
- Install ChromeDriver and add to PATH
- Or use `webdriver-manager` for automatic installation

**Error: "session not created: This version of ChromeDriver only supports Chrome version X"**
- Download ChromeDriver matching your Chrome version
- Or update Chrome to match your ChromeDriver

### Scraping Issues

**No products found**
- Check if the URL is correct
- Try running with `--visible` to see what's happening
- The site might use different selectors - customize them in the code

**Timeout errors**
- Increase timeout: `--timeout 20`
- Check your internet connection
- Site might be slow or blocking automated access

**Missing product data**
- Some fields might use different selectors
- Customize extraction methods for specific websites
- Check HTML source of target website

### Anti-Scraping Measures

Some websites implement anti-scraping measures:

- **Rate Limiting**: Add delays between requests (already implemented)
- **CAPTCHA**: May require manual intervention
- **IP Blocking**: Use proxies or VPN
- **User-Agent Detection**: Script already uses realistic user-agent

## Best Practices

1. **Respect robots.txt**: Check the website's robots.txt file
2. **Rate Limiting**: Don't overload servers (delays are built-in)
3. **Terms of Service**: Ensure scraping is allowed
4. **Personal Use**: Use scraped data responsibly
5. **Error Handling**: Monitor logs for issues

## Logging

The scraper logs progress and errors to the console:

```
2024-12-23 10:30:45 - INFO - Initialized scraper for https://example.com
2024-12-23 10:30:48 - INFO - Starting to load all products...
2024-12-23 10:30:52 - INFO - Clicked 'Load More' button (attempt 1)
2024-12-23 10:31:05 - INFO - Found 50 new product URLs (total: 50)
2024-12-23 10:31:06 - INFO - Progress: 1/50
2024-12-23 10:31:08 - INFO - Scraping product: https://example.com/product/1
...
```

## Dependencies

- **selenium**: Web browser automation
- **beautifulsoup4**: HTML parsing
- **lxml**: XML/HTML parser (faster than html.parser)
- **requests**: HTTP library (optional)
- **webdriver-manager**: Automatic ChromeDriver installation (optional)

## License

This scraper is provided as-is for educational and personal use. Always ensure you have permission to scrape websites and comply with their terms of service.

## Contributing

Feel free to customize this scraper for your specific needs. Common customizations:

- Add support for additional product attributes
- Implement proxy rotation
- Add database export options
- Support for other browsers (Firefox, Edge)
- Multi-threading for faster scraping

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the logs for error messages
3. Verify the target website's HTML structure
4. Customize selectors for specific websites

## Version

Current version: 1.0.0

## Updates

- **1.0.0** (2024-12-23): Initial release
  - Load More button support
  - Traditional pagination support
  - Comprehensive product detail extraction
  - CSV export functionality
