#!/usr/bin/env python3
"""
Basic tests for the products scraper
Tests the structure and basic functionality without requiring Selenium
"""

import sys
import unittest
from unittest.mock import Mock, patch, MagicMock


class TestProductsScraperStructure(unittest.TestCase):
    """Test the basic structure of the scraper"""
    
    def test_import_scraper(self):
        """Test that the scraper module can be imported"""
        try:
            import products_scraper
            self.assertTrue(hasattr(products_scraper, 'ProductsScraper'))
            self.assertTrue(hasattr(products_scraper, 'main'))
            self.assertTrue(hasattr(products_scraper, 'DEPENDENCIES_INSTALLED'))
        except SystemExit:
            self.fail("Scraper should not exit on import when used as module")
    
    def test_scraper_class_methods(self):
        """Test that ProductsScraper has required methods"""
        try:
            from products_scraper import ProductsScraper, DEPENDENCIES_INSTALLED
            
            if not DEPENDENCIES_INSTALLED:
                self.skipTest("Dependencies not installed (expected)")
                return
            
            required_methods = [
                'scroll_and_load_more',
                'handle_pagination',
                'extract_product_urls_from_page',
                'scrape_product_details',
                'scrape_all_products',
                'export_to_csv',
                '_extract_title',
                '_extract_price',
                '_extract_description',
                '_extract_image',
                '_extract_sku',
                '_extract_availability',
                '_extract_category',
                '_extract_brand',
                '_is_product_url',
            ]
            
            for method in required_methods:
                self.assertTrue(
                    hasattr(ProductsScraper, method),
                    f"ProductsScraper should have {method} method"
                )
        except SystemExit:
            self.fail("Scraper should not exit on import when used as module")
    
    def test_is_product_url_logic(self):
        """Test URL filtering logic"""
        try:
            from products_scraper import ProductsScraper, DEPENDENCIES_INSTALLED
            
            if not DEPENDENCIES_INSTALLED:
                self.skipTest("Dependencies not installed (expected)")
                return
            
            # Mock the driver to avoid selenium requirement
            with patch('products_scraper.webdriver'):
                scraper = ProductsScraper("https://example.com", headless=True)
                
                # Valid product URLs
                self.assertTrue(scraper._is_product_url("https://example.com/product/123"))
                self.assertTrue(scraper._is_product_url("https://example.com/products/item"))
                
                # Invalid URLs
                self.assertFalse(scraper._is_product_url("https://example.com/cart"))
                self.assertFalse(scraper._is_product_url("https://example.com/checkout"))
                self.assertFalse(scraper._is_product_url("https://example.com/login"))
                self.assertFalse(scraper._is_product_url("javascript:void(0)"))
                self.assertFalse(scraper._is_product_url("https://example.com/image.jpg"))
                
        except SystemExit:
            self.fail("Scraper should not exit on import when used as module")


class TestScraperConfiguration(unittest.TestCase):
    """Test scraper configuration and setup"""
    
    def test_requirements_file_exists(self):
        """Test that requirements.txt exists and contains required packages"""
        import os
        
        self.assertTrue(
            os.path.exists('requirements.txt'),
            "requirements.txt should exist"
        )
        
        with open('requirements.txt', 'r') as f:
            requirements = f.read()
            
            required_packages = ['selenium', 'beautifulsoup4', 'lxml']
            for package in required_packages:
                self.assertIn(
                    package,
                    requirements,
                    f"{package} should be in requirements.txt"
                )
    
    def test_scraper_script_exists(self):
        """Test that the main scraper script exists"""
        import os
        
        self.assertTrue(
            os.path.exists('products_scraper.py'),
            "products_scraper.py should exist"
        )
    
    def test_documentation_exists(self):
        """Test that documentation files exist"""
        import os
        
        docs = ['SCRAPER_README.md', 'QUICKSTART.md', 'scraper_examples.py']
        for doc in docs:
            self.assertTrue(
                os.path.exists(doc),
                f"{doc} should exist"
            )


class TestExampleScript(unittest.TestCase):
    """Test the example script"""
    
    def test_example_script_syntax(self):
        """Test that example script has valid syntax"""
        import py_compile
        
        try:
            py_compile.compile('scraper_examples.py', doraise=True)
        except py_compile.PyCompileError as e:
            self.fail(f"scraper_examples.py has syntax errors: {e}")


def run_tests():
    """Run all tests"""
    # Create test suite
    loader = unittest.TestLoader()
    suite = unittest.TestSuite()
    
    # Add test classes
    suite.addTests(loader.loadTestsFromTestCase(TestProductsScraperStructure))
    suite.addTests(loader.loadTestsFromTestCase(TestScraperConfiguration))
    suite.addTests(loader.loadTestsFromTestCase(TestExampleScript))
    
    # Run tests
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    # Return exit code
    return 0 if result.wasSuccessful() else 1


if __name__ == '__main__':
    sys.exit(run_tests())
