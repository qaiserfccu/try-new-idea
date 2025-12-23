# Quick Start Guide - Python Products Scraper

This guide will help you get started with the Python products scraper in under 5 minutes.

## Prerequisites

- Python 3.7+
- Google Chrome browser installed
- pip (Python package manager)

## Installation

### Step 1: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 2: Install ChromeDriver

**Option A: Automatic (Recommended)**
```bash
pip install webdriver-manager
```

**Option B: Manual**
1. Check your Chrome version at `chrome://version/`
2. Download matching ChromeDriver from [https://chromedriver.chromium.org/downloads](https://chromedriver.chromium.org/downloads)
3. Add to your system PATH

## Usage

### Basic Command

```bash
python products_scraper.py <URL>
```

### Example

```bash
# Scrape products from a website
python products_scraper.py https://chiltanpure.com/products

# Save to custom filename
python products_scraper.py https://example.com/products --output my_products.csv

# Limit to 3 pages with pagination
python products_scraper.py https://example.com/products --no-load-more --max-pages 3

# Run in visible mode (for debugging)
python products_scraper.py https://example.com/products --visible
```

## How It Works

1. **Loads the page**: Opens the product listing URL
2. **Handles pagination**: 
   - Automatically clicks "Load More" buttons OR
   - Navigates through page numbers
3. **Collects URLs**: Extracts all product page URLs
4. **Visits each product**: Scrapes detailed information
5. **Exports to CSV**: Saves all data in a structured format

## Output

The scraper creates a CSV file with columns:
- URL
- Title
- Price
- Description
- Image URL
- SKU
- Availability
- Category
- Brand

## Command-Line Options

| Option | Description | Example |
|--------|-------------|---------|
| `--output`, `-o` | Output filename | `--output products.csv` |
| `--max-pages` | Max pages to scrape | `--max-pages 5` |
| `--no-load-more` | Use pagination instead | `--no-load-more` |
| `--visible` | Show browser | `--visible` |
| `--timeout` | Wait timeout (seconds) | `--timeout 15` |

## Need Help?

```bash
python products_scraper.py --help
```

For detailed documentation, see [SCRAPER_README.md](SCRAPER_README.md)

## Troubleshooting

**"chromedriver executable needs to be in PATH"**
→ Install ChromeDriver (see Step 2 above)

**"No products found"**
→ Try with `--visible` flag to debug
→ Website might use different HTML structure

**Timeout errors**
→ Increase timeout: `--timeout 20`

## Examples

See [scraper_examples.py](scraper_examples.py) for programmatic usage examples.
