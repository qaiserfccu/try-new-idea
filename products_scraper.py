#!/usr/bin/env python3
"""
Products Scraper - A web scraper for extracting product information from e-commerce sites

This script handles:
- Pagination (both traditional pagination and "Load More" button)
- Extracting product URLs from listing pages
- Visiting each product detail page
- Extracting product details
- Exporting data to CSV file

Usage:
    python products_scraper.py <URL> [--output output.csv] [--max-pages 10]
"""

import argparse
import csv
import logging
import time
from typing import List, Dict, Optional
from urllib.parse import urljoin, urlparse
import sys

try:
    from selenium import webdriver
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    from selenium.webdriver.chrome.options import Options
    from selenium.common.exceptions import (
        TimeoutException, 
        NoSuchElementException,
        StaleElementReferenceException
    )
    from bs4 import BeautifulSoup
except ImportError:
    print("Error: Required packages not installed.")
    print("Please install dependencies using: pip install -r requirements.txt")
    sys.exit(1)


# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class ProductsScraper:
    """Web scraper for extracting product information from e-commerce websites"""
    
    def __init__(self, base_url: str, headless: bool = True, timeout: int = 10):
        """
        Initialize the scraper
        
        Args:
            base_url: The starting URL to scrape
            headless: Whether to run browser in headless mode
            timeout: Default timeout for waiting for elements
        """
        self.base_url = base_url
        self.timeout = timeout
        self.product_urls = set()
        self.products_data = []
        
        # Setup Chrome driver
        chrome_options = Options()
        if headless:
            chrome_options.add_argument('--headless')
            chrome_options.add_argument('--no-sandbox')
            chrome_options.add_argument('--disable-dev-shm-usage')
        
        chrome_options.add_argument('--disable-blink-features=AutomationControlled')
        chrome_options.add_argument('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
        
        self.driver = webdriver.Chrome(options=chrome_options)
        self.wait = WebDriverWait(self.driver, self.timeout)
        
        logger.info(f"Initialized scraper for {base_url}")
    
    def __del__(self):
        """Cleanup - close browser"""
        if hasattr(self, 'driver'):
            self.driver.quit()
    
    def scroll_and_load_more(self, max_attempts: int = 50) -> None:
        """
        Scroll page and click 'Load More' button if present
        
        Args:
            max_attempts: Maximum number of times to click "Load More"
        """
        logger.info("Starting to load all products...")
        attempts = 0
        
        while attempts < max_attempts:
            # Scroll to bottom
            self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(2)  # Wait for content to load
            
            # Try to find and click "Load More" button
            load_more_selectors = [
                "//button[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'load more')]",
                "//a[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'load more')]",
                "//button[contains(@class, 'load-more')]",
                "//a[contains(@class, 'load-more')]",
                "//button[contains(@class, 'loadmore')]",
                "//a[contains(@class, 'loadmore')]",
            ]
            
            button_found = False
            for selector in load_more_selectors:
                try:
                    button = self.driver.find_element(By.XPATH, selector)
                    if button.is_displayed() and button.is_enabled():
                        self.driver.execute_script("arguments[0].scrollIntoView(true);", button)
                        time.sleep(1)
                        button.click()
                        logger.info(f"Clicked 'Load More' button (attempt {attempts + 1})")
                        button_found = True
                        time.sleep(3)  # Wait for new content to load
                        break
                except (NoSuchElementException, StaleElementReferenceException):
                    continue
                except Exception as e:
                    logger.debug(f"Error clicking load more button: {e}")
                    continue
            
            if not button_found:
                logger.info("No more 'Load More' button found or all products loaded")
                break
            
            attempts += 1
        
        # Final scroll to ensure all lazy-loaded content is visible
        self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(2)
    
    def handle_pagination(self, max_pages: int = 10) -> None:
        """
        Handle traditional pagination by clicking next page buttons
        
        Args:
            max_pages: Maximum number of pages to scrape
        """
        page = 1
        
        while page <= max_pages:
            logger.info(f"Scraping page {page}...")
            
            # Extract products from current page
            self.extract_product_urls_from_page()
            
            # Try to find next page button
            next_button_selectors = [
                "//a[contains(@class, 'next')]",
                "//button[contains(@class, 'next')]",
                "//a[@rel='next']",
                "//a[contains(text(), 'Next')]",
                "//button[contains(text(), 'Next')]",
                "//a[contains(@aria-label, 'next')]",
            ]
            
            button_found = False
            for selector in next_button_selectors:
                try:
                    next_button = self.driver.find_element(By.XPATH, selector)
                    if next_button.is_displayed() and next_button.is_enabled():
                        self.driver.execute_script("arguments[0].scrollIntoView(true);", next_button)
                        time.sleep(1)
                        next_button.click()
                        time.sleep(3)  # Wait for page to load
                        button_found = True
                        break
                except (NoSuchElementException, StaleElementReferenceException):
                    continue
                except Exception as e:
                    logger.debug(f"Error clicking next button: {e}")
                    continue
            
            if not button_found:
                logger.info("No next page button found - reached end of pagination")
                break
            
            page += 1
    
    def extract_product_urls_from_page(self) -> None:
        """Extract all product URLs from the current page"""
        soup = BeautifulSoup(self.driver.page_source, 'html.parser')
        
        # Common selectors for product links
        product_link_selectors = [
            'a[href*="/product"]',
            'a[href*="/products"]',
            'a[class*="product"]',
            '.product a',
            '.product-item a',
            '.product-card a',
            'article a',
            '[data-product] a',
        ]
        
        initial_count = len(self.product_urls)
        
        for selector in product_link_selectors:
            links = soup.select(selector)
            for link in links:
                href = link.get('href')
                if href:
                    # Convert relative URLs to absolute
                    full_url = urljoin(self.base_url, href)
                    
                    # Filter out non-product URLs
                    if self._is_product_url(full_url):
                        self.product_urls.add(full_url)
        
        new_count = len(self.product_urls) - initial_count
        if new_count > 0:
            logger.info(f"Found {new_count} new product URLs (total: {len(self.product_urls)})")
    
    def _is_product_url(self, url: str) -> bool:
        """
        Determine if a URL is likely a product detail page
        
        Args:
            url: URL to check
            
        Returns:
            True if URL appears to be a product page
        """
        # Avoid URLs that are likely not product pages
        exclude_patterns = [
            '/cart', '/checkout', '/account', '/login', '/signup',
            '/category', '/categories', '/search', '/about', '/contact',
            '/blog', '/news', '/faq', '/terms', '/privacy',
            '#', 'javascript:', 'mailto:', 'tel:',
            '.pdf', '.jpg', '.png', '.gif'
        ]
        
        url_lower = url.lower()
        for pattern in exclude_patterns:
            if pattern in url_lower:
                return False
        
        return True
    
    def scrape_product_details(self, url: str) -> Optional[Dict]:
        """
        Visit a product page and extract details
        
        Args:
            url: Product page URL
            
        Returns:
            Dictionary containing product details or None if scraping failed
        """
        try:
            logger.info(f"Scraping product: {url}")
            self.driver.get(url)
            time.sleep(2)  # Wait for page to load
            
            soup = BeautifulSoup(self.driver.page_source, 'html.parser')
            
            # Extract product details
            product = {
                'url': url,
                'title': self._extract_title(soup),
                'price': self._extract_price(soup),
                'description': self._extract_description(soup),
                'image_url': self._extract_image(soup),
                'sku': self._extract_sku(soup),
                'availability': self._extract_availability(soup),
                'category': self._extract_category(soup),
                'brand': self._extract_brand(soup),
            }
            
            return product
            
        except Exception as e:
            logger.error(f"Error scraping product {url}: {e}")
            return None
    
    def _extract_title(self, soup: BeautifulSoup) -> str:
        """Extract product title"""
        selectors = [
            'h1[class*="product"]',
            'h1[class*="title"]',
            '.product-title',
            '.product-name',
            'h1',
            '[itemprop="name"]',
        ]
        
        for selector in selectors:
            element = soup.select_one(selector)
            if element:
                return element.get_text(strip=True)
        
        return "N/A"
    
    def _extract_price(self, soup: BeautifulSoup) -> str:
        """Extract product price"""
        selectors = [
            '[class*="price"]',
            '[itemprop="price"]',
            '.product-price',
            'span[class*="amount"]',
        ]
        
        for selector in selectors:
            element = soup.select_one(selector)
            if element:
                price_text = element.get_text(strip=True)
                if price_text and any(char.isdigit() for char in price_text):
                    return price_text
        
        return "N/A"
    
    def _extract_description(self, soup: BeautifulSoup) -> str:
        """Extract product description"""
        selectors = [
            '[class*="description"]',
            '[itemprop="description"]',
            '.product-description',
            '.product-details',
        ]
        
        for selector in selectors:
            element = soup.select_one(selector)
            if element:
                desc = element.get_text(strip=True)
                # Limit description length
                return desc[:500] if len(desc) > 500 else desc
        
        return "N/A"
    
    def _extract_image(self, soup: BeautifulSoup) -> str:
        """Extract product main image URL"""
        selectors = [
            'img[class*="product"]',
            '[itemprop="image"]',
            '.product-image img',
            '.product-gallery img',
        ]
        
        for selector in selectors:
            element = soup.select_one(selector)
            if element:
                img_url = element.get('src') or element.get('data-src')
                if img_url:
                    return urljoin(self.base_url, img_url)
        
        return "N/A"
    
    def _extract_sku(self, soup: BeautifulSoup) -> str:
        """Extract product SKU"""
        selectors = [
            '[itemprop="sku"]',
            '.sku',
            '[class*="sku"]',
        ]
        
        for selector in selectors:
            element = soup.select_one(selector)
            if element:
                return element.get_text(strip=True)
        
        return "N/A"
    
    def _extract_availability(self, soup: BeautifulSoup) -> str:
        """Extract product availability status"""
        selectors = [
            '[itemprop="availability"]',
            '.availability',
            '[class*="stock"]',
        ]
        
        for selector in selectors:
            element = soup.select_one(selector)
            if element:
                return element.get_text(strip=True)
        
        # Check for common availability indicators
        text = soup.get_text().lower()
        if 'in stock' in text:
            return "In Stock"
        elif 'out of stock' in text:
            return "Out of Stock"
        
        return "N/A"
    
    def _extract_category(self, soup: BeautifulSoup) -> str:
        """Extract product category"""
        selectors = [
            '[class*="breadcrumb"] a',
            '.category',
            '[class*="category"]',
        ]
        
        for selector in selectors:
            elements = soup.select(selector)
            if elements:
                # Get the last category in breadcrumb
                return elements[-1].get_text(strip=True)
        
        return "N/A"
    
    def _extract_brand(self, soup: BeautifulSoup) -> str:
        """Extract product brand"""
        selectors = [
            '[itemprop="brand"]',
            '.brand',
            '[class*="brand"]',
        ]
        
        for selector in selectors:
            element = soup.select_one(selector)
            if element:
                return element.get_text(strip=True)
        
        return "N/A"
    
    def scrape_all_products(self, use_load_more: bool = True, max_pages: int = 10) -> None:
        """
        Main scraping workflow
        
        Args:
            use_load_more: Whether to handle "Load More" buttons
            max_pages: Maximum pages to scrape if using pagination
        """
        try:
            # Load initial page
            logger.info(f"Loading initial page: {self.base_url}")
            self.driver.get(self.base_url)
            time.sleep(3)
            
            # Handle loading all products
            if use_load_more:
                self.scroll_and_load_more()
            else:
                self.handle_pagination(max_pages)
            
            # Extract product URLs from the final loaded page
            self.extract_product_urls_from_page()
            
            if not self.product_urls:
                logger.warning("No product URLs found!")
                return
            
            logger.info(f"Found total of {len(self.product_urls)} product URLs")
            
            # Visit each product page and extract details
            logger.info("Starting to scrape individual product pages...")
            for i, url in enumerate(self.product_urls, 1):
                logger.info(f"Progress: {i}/{len(self.product_urls)}")
                product_data = self.scrape_product_details(url)
                if product_data:
                    self.products_data.append(product_data)
                
                # Small delay to avoid overwhelming the server
                time.sleep(1)
            
            logger.info(f"Successfully scraped {len(self.products_data)} products")
            
        except Exception as e:
            logger.error(f"Error during scraping: {e}")
            raise
    
    def export_to_csv(self, filename: str = 'products.csv') -> None:
        """
        Export scraped products to CSV file
        
        Args:
            filename: Output CSV filename
        """
        if not self.products_data:
            logger.warning("No product data to export")
            return
        
        try:
            # Get all unique keys from products
            fieldnames = set()
            for product in self.products_data:
                fieldnames.update(product.keys())
            
            fieldnames = sorted(fieldnames)
            
            with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                writer.writeheader()
                writer.writerows(self.products_data)
            
            logger.info(f"Successfully exported {len(self.products_data)} products to {filename}")
            
        except Exception as e:
            logger.error(f"Error exporting to CSV: {e}")
            raise


def main():
    """Main entry point for the script"""
    parser = argparse.ArgumentParser(
        description='Scrape product information from e-commerce websites',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python products_scraper.py https://example.com/products
  python products_scraper.py https://example.com/products --output my_products.csv
  python products_scraper.py https://example.com/products --no-load-more --max-pages 5
        """
    )
    
    parser.add_argument(
        'url',
        help='URL of the products listing page to scrape'
    )
    
    parser.add_argument(
        '--output', '-o',
        default='products.csv',
        help='Output CSV filename (default: products.csv)'
    )
    
    parser.add_argument(
        '--max-pages',
        type=int,
        default=10,
        help='Maximum number of pages to scrape when using pagination (default: 10)'
    )
    
    parser.add_argument(
        '--no-load-more',
        action='store_true',
        help='Disable "Load More" button handling and use pagination instead'
    )
    
    parser.add_argument(
        '--visible',
        action='store_true',
        help='Run browser in visible mode (not headless)'
    )
    
    parser.add_argument(
        '--timeout',
        type=int,
        default=10,
        help='Timeout for waiting for elements (default: 10 seconds)'
    )
    
    args = parser.parse_args()
    
    # Validate URL
    parsed_url = urlparse(args.url)
    if not parsed_url.scheme or not parsed_url.netloc:
        logger.error("Invalid URL provided. Please provide a complete URL (e.g., https://example.com)")
        sys.exit(1)
    
    # Create scraper instance
    scraper = ProductsScraper(
        base_url=args.url,
        headless=not args.visible,
        timeout=args.timeout
    )
    
    try:
        # Run scraping
        scraper.scrape_all_products(
            use_load_more=not args.no_load_more,
            max_pages=args.max_pages
        )
        
        # Export results
        scraper.export_to_csv(args.output)
        
        logger.info("Scraping completed successfully!")
        
    except KeyboardInterrupt:
        logger.info("Scraping interrupted by user")
        sys.exit(1)
    except Exception as e:
        logger.error(f"Scraping failed: {e}")
        sys.exit(1)
    finally:
        # Cleanup
        del scraper


if __name__ == '__main__':
    main()
