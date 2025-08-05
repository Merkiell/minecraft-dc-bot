const puppeteer = require('puppeteer');
const { logger } = require('../utils/logger');

class AternosResearch {
    constructor() {
        this.browser = null;
        this.page = null;
        this.isLoggedIn = false;
        this.username = process.env.ATERNOS_USERNAME;
        this.password = process.env.ATERNOS_PASSWORD;
    }

    async init() {
        try {
            logger.info('Initializing browser for Aternos research...');
            
            this.browser = await puppeteer.launch({
                headless: false, // Set to true for production
                defaultViewport: { width: 1280, height: 720 },
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--disable-gpu'
                ]
            });

            this.page = await this.browser.newPage();
            
            // Set user agent to avoid detection
            await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
            
            logger.info('Browser initialized successfully');
            return true;
            
        } catch (error) {
            logger.error('Failed to initialize browser:', error);
            return false;
        }
    }

    async navigateToAternos() {
        try {
            logger.info('Navigating to Aternos...');
            await this.page.goto('https://aternos.org', { 
                waitUntil: 'networkidle2',
                timeout: 30000 
            });
            
            logger.info('Successfully loaded Aternos homepage');
            
            // Take a screenshot for research
            await this.page.screenshot({ 
                path: 'aternos-homepage.png',
                fullPage: true 
            });
            
            return true;
            
        } catch (error) {
            logger.error('Failed to navigate to Aternos:', error);
            return false;
        }
    }

    async researchLoginProcess() {
        try {
            logger.info('Researching Aternos login process...');
            
            // Look for login elements
            const loginElements = await this.page.evaluate(() => {
                const elements = {
                    loginButtons: [],
                    usernameInputs: [],
                    passwordInputs: [],
                    forms: []
                };

                // Find login buttons
                document.querySelectorAll('button, a, input[type="submit"]').forEach(el => {
                    const text = el.textContent?.toLowerCase() || '';
                    const value = el.value?.toLowerCase() || '';
                    if (text.includes('login') || text.includes('sign in') || value.includes('login')) {
                        elements.loginButtons.push({
                            tagName: el.tagName,
                            text: el.textContent,
                            id: el.id,
                            className: el.className,
                            type: el.type
                        });
                    }
                });

                // Find username inputs
                document.querySelectorAll('input').forEach(el => {
                    const type = el.type?.toLowerCase() || '';
                    const name = el.name?.toLowerCase() || '';
                    const id = el.id?.toLowerCase() || '';
                    const placeholder = el.placeholder?.toLowerCase() || '';
                    
                    if (type === 'text' || type === 'email' || 
                        name.includes('user') || name.includes('email') ||
                        id.includes('user') || id.includes('email') ||
                        placeholder.includes('user') || placeholder.includes('email')) {
                        elements.usernameInputs.push({
                            type: el.type,
                            name: el.name,
                            id: el.id,
                            placeholder: el.placeholder,
                            className: el.className
                        });
                    }
                    
                    if (type === 'password') {
                        elements.passwordInputs.push({
                            name: el.name,
                            id: el.id,
                            placeholder: el.placeholder,
                            className: el.className
                        });
                    }
                });

                // Find forms
                document.querySelectorAll('form').forEach(el => {
                    elements.forms.push({
                        action: el.action,
                        method: el.method,
                        id: el.id,
                        className: el.className
                    });
                });

                return elements;
            });

            logger.info('Login research results:', JSON.stringify(loginElements, null, 2));
            
            return loginElements;
            
        } catch (error) {
            logger.error('Failed to research login process:', error);
            return null;
        }
    }

    async attemptLogin() {
        try {
            if (!this.username || !this.password) {
                logger.warn('No Aternos credentials provided in environment variables');
                return false;
            }

            logger.info('Attempting to login to Aternos...');
            
            // This is where we'll implement the actual login logic
            // after researching the login elements
            
            logger.warn('Login implementation not yet complete - this is research phase');
            return false;
            
        } catch (error) {
            logger.error('Failed to attempt login:', error);
            return false;
        }
    }

    async researchServerManagement() {
        try {
            logger.info('Researching server management interface...');
            
            // Look for server-related elements
            const serverElements = await this.page.evaluate(() => {
                const elements = {
                    serverCards: [],
                    serverButtons: [],
                    serverStatus: []
                };

                // Look for elements that might contain server information
                document.querySelectorAll('*').forEach(el => {
                    const text = el.textContent?.toLowerCase() || '';
                    const className = el.className?.toLowerCase() || '';
                    const id = el.id?.toLowerCase() || '';
                    
                    if (text.includes('server') || className.includes('server') || id.includes('server')) {
                        elements.serverCards.push({
                            tagName: el.tagName,
                            text: el.textContent?.substring(0, 100),
                            className: el.className,
                            id: el.id
                        });
                    }
                    
                    if (text.includes('online') || text.includes('offline') || text.includes('starting')) {
                        elements.serverStatus.push({
                            tagName: el.tagName,
                            text: el.textContent,
                            className: el.className,
                            id: el.id
                        });
                    }
                });

                return elements;
            });

            logger.info('Server management research results:', JSON.stringify(serverElements, null, 2));
            
            return serverElements;
            
        } catch (error) {
            logger.error('Failed to research server management:', error);
            return null;
        }
    }

    async cleanup() {
        try {
            if (this.browser) {
                await this.browser.close();
                logger.info('Browser closed successfully');
            }
        } catch (error) {
            logger.error('Error during cleanup:', error);
        }
    }
}

module.exports = { AternosResearch };
