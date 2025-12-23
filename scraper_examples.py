#!/usr/bin/env python3
"""
Example script showing how to use the ProductsScraper class programmatically

This demonstrates various ways to use the scraper without command-line arguments.
"""

from products_scraper import ProductsScraper
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)


def example_basic_usage():
    """Basic example: Scrape with default settings"""
    print("\n=== Example 1: Basic Usage ===")
    
    url = "https://chiltanpure.com/products"
    scraper = ProductsScraper(base_url=url, headless=True)
    
    try:
        scraper.scrape_all_products(use_load_more=True, max_pages=10)
        scraper.export_to_csv('products_basic.csv')
    finally:
        del scraper


def example_pagination_mode():
    """Example: Use pagination instead of load more"""
    print("\n=== Example 2: Pagination Mode ===")
    
    url = "https://example.com/shop"
    scraper = ProductsScraper(base_url=url, headless=True, timeout=15)
    
    try:
        # Use traditional pagination for 3 pages
        scraper.scrape_all_products(use_load_more=False, max_pages=3)
        scraper.export_to_csv('products_paginated.csv')
    finally:
        del scraper


def example_visible_browser():
    """Example: Run with visible browser for debugging"""
    print("\n=== Example 3: Visible Browser Mode ===")
    
    url = "https://example.com/products"
    # Set headless=False to see the browser
    scraper = ProductsScraper(base_url=url, headless=False)
    
    try:
        scraper.scrape_all_products(use_load_more=True, max_pages=5)
        scraper.export_to_csv('products_visible.csv')
    finally:
        del scraper


def example_custom_processing():
    """Example: Custom processing of scraped data"""
    print("\n=== Example 4: Custom Data Processing ===")
    
    url = "https://example.com/products"
    scraper = ProductsScraper(base_url=url, headless=True)
    
    try:
        scraper.scrape_all_products(use_load_more=True, max_pages=10)
        
        # Access the products data directly
        products = scraper.products_data
        
        # Filter products by price (example)
        print(f"\nTotal products scraped: {len(products)}")
        
        # Show first few products
        print("\nFirst 3 products:")
        for i, product in enumerate(products[:3], 1):
            print(f"{i}. {product.get('title', 'N/A')} - {product.get('price', 'N/A')}")
        
        # Export to CSV
        scraper.export_to_csv('products_custom.csv')
        
        # You could also:
        # - Filter products by category
        # - Calculate average prices
        # - Find products without images
        # - Export to different formats (JSON, Excel, etc.)
        
    finally:
        del scraper


def example_error_handling():
    """Example: Proper error handling"""
    print("\n=== Example 5: With Error Handling ===")
    
    url = "https://example.com/products"
    scraper = None
    
    try:
        scraper = ProductsScraper(base_url=url, headless=True, timeout=10)
        scraper.scrape_all_products(use_load_more=True, max_pages=10)
        
        if scraper.products_data:
            scraper.export_to_csv('products_safe.csv')
            print(f"Successfully scraped {len(scraper.products_data)} products")
        else:
            print("No products were scraped")
            
    except Exception as e:
        print(f"Error during scraping: {e}")
    finally:
        if scraper:
            del scraper


if __name__ == '__main__':
    print("Products Scraper - Usage Examples")
    print("=" * 50)
    
    # Uncomment the example you want to run:
    
    # example_basic_usage()
    # example_pagination_mode()
    # example_visible_browser()
    # example_custom_processing()
    # example_error_handling()
    
    print("\n" + "=" * 50)
    print("To run an example, uncomment it in the main section.")
    print("\nFor command-line usage, use:")
    print("  python products_scraper.py <URL> [options]")
    print("\nFor help:")
    print("  python products_scraper.py --help")
