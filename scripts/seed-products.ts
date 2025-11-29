import { Amplify } from 'aws-amplify';
import { signIn, fetchAuthSession } from 'aws-amplify/auth';
import { post } from 'aws-amplify/api';
import { v4 as uuidv4 } from 'uuid';
import * as readline from 'readline';
import * as fs from 'fs';
import * as path from 'path';

// Load Amplify configuration from JSON file
const configPath = path.join(process.cwd(), 'app', 'amplifyconfiguration.json');
const awsConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

// Configure Amplify
Amplify.configure(awsConfig);

interface IProduct {
    id: string;
    category: string;
    name: string;
    description: string;
    price: number;
    salePrice?: number | null;
    status: 'active' | 'inactive';
    quantity: number;
    images: string[] | null;
    created_at: number;
    updated_at: number;
}

interface SourceProduct {
    id?: string;
    category?: string;
    name?: string;
    description?: string;
    price?: number;
    salePrice?: number | null;
    status?: string;
    quantity?: number;
    images?: string[] | null;
    created_at?: number;
    updated_at?: number;
    [key: string]: any;
}

// Category mapping from production to local
const categoryMap: Record<string, string> = {
    'Bangle': 'bangles',
    'Bracelet': 'bracelets',
    'Earring': 'earrings',
    'Necklace': 'necklaces',
    'Ring': 'rings',
    'Set': 'sets',
};

// Terminal input helper
function question(rl: readline.Interface, query: string): Promise<string> {
    return new Promise(resolve => rl.question(query, resolve));
}

// Password input (visible for cross-platform compatibility)
// Note: Password will be visible as you type
function questionPassword(rl: readline.Interface, query: string): Promise<string> {
    return question(rl, query);
}

async function authenticate(): Promise<boolean> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    try {
        console.log('\n=== Cognito Authentication ===');
        console.log('Note: Password will be visible as you type\n');
        const email = await question(rl, 'Email: ');
        const password = await questionPassword(rl, 'Password: ');
        rl.close();

        console.log('\nAuthenticating...');
        const result = await signIn({
            username: email.trim(),
            password: password.trim()
        });

        if (result.isSignedIn) {
            console.log('✓ Authentication successful!\n');
            return true;
        } else {
            console.error('✗ Authentication failed. Please check your credentials.');
            return false;
        }
    } catch (error: any) {
        rl.close();
        console.error('✗ Authentication error:', error.message);
        if (error.name === 'UserNotConfirmedException') {
            console.error('  Please verify your email before signing in.');
        } else if (error.name === 'NotAuthorizedException') {
            console.error('  Incorrect email or password.');
        } else if (error.name === 'UserNotFoundException') {
            console.error('  User not found. Please check your email.');
        }
        return false;
    }
}

async function fetchProductsFromProduction(): Promise<SourceProduct[]> {
    const productionApiUrl = 'https://rqago7s9cj.execute-api.ap-southeast-1.amazonaws.com/prod/products';
    
    console.log('Fetching products from production API...');
    try {
        const response = await fetch(productionApiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const products = await response.json();
        console.log(`✓ Fetched ${products.length} products from production\n`);
        return products;
    } catch (error: any) {
        console.error('✗ Failed to fetch products:', error.message);
        throw error;
    }
}

function transformProduct(sourceProduct: SourceProduct): IProduct {
    const now = Math.floor(Date.now() / 1000);
    
    // Map category
    let category = sourceProduct.category?.toLowerCase() || 'bangles';
    if (categoryMap[sourceProduct.category || '']) {
        category = categoryMap[sourceProduct.category || ''];
    }
    
    // Ensure category is one of the valid values
    const validCategories = ['bangles', 'bracelets', 'earrings', 'necklaces', 'rings', 'sets'];
    if (!validCategories.includes(category)) {
        category = 'bangles'; // default fallback
    }

    // Transform the product
    const transformed: IProduct = {
        id: sourceProduct.id || uuidv4(),
        category: category,
        name: sourceProduct.name || 'Unnamed Product',
        description: sourceProduct.description || '',
        price: sourceProduct.price || 0,
        salePrice: sourceProduct.salePrice || null,
        status: (sourceProduct.status === 'active' || sourceProduct.status === 'inactive') 
            ? sourceProduct.status as 'active' | 'inactive'
            : 'active',
        quantity: sourceProduct.quantity ?? 10,
        images: sourceProduct.images || null,
        created_at: sourceProduct.created_at || now,
        updated_at: sourceProduct.updated_at || now,
    };

    return transformed;
}

async function insertProduct(product: IProduct, apiName: string): Promise<boolean> {
    try {
        const operation = await post({
            apiName: apiName,
            path: '/products',
            options: {
                body: {
                    id: product.id,
                    category: product.category,
                    name: product.name,
                    description: product.description,
                    images: product.images,
                    price: product.price,
                    salePrice: product.salePrice,
                    quantity: product.quantity,
                    status: product.status,
                    created_at: product.created_at,
                    updated_at: product.updated_at
                }
            }
        }).response;

        const response = await operation.body.json() as any;
        return response?.success || false;
    } catch (error: any) {
        console.error(`  Error inserting product ${product.name}:`, error.message);
        return false;
    }
}

async function saveSeedData(products: IProduct[]): Promise<void> {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    const filePath = path.join(dataDir, 'seed-products.json');
    const data = {
        metadata: {
            totalProducts: products.length,
            generatedAt: new Date().toISOString(),
            categories: [...new Set(products.map(p => p.category))],
        },
        products: products
    };

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`\n✓ Seed data saved to ${filePath}`);
}

async function main() {
    try {
        // Step 1: Authenticate
        const authenticated = await authenticate();
        if (!authenticated) {
            process.exit(1);
        }

        // Step 2: Get API name from environment or config
        const apiName = process.env.API_NAME || 'BarelyGoldAPI';
        console.log(`Using API: ${apiName}\n`);

        // Step 3: Fetch products from production
        const sourceProducts = await fetchProductsFromProduction();

        // Step 4: Transform products
        console.log('Transforming products...');
        const transformedProducts = sourceProducts.map(transformProduct);
        console.log(`✓ Transformed ${transformedProducts.length} products\n`);

        // Step 5: Save seed data as backup
        await saveSeedData(transformedProducts);

        // Step 6: Insert products into database
        console.log('\nInserting products into database...');
        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < transformedProducts.length; i++) {
            const product = transformedProducts[i];
            process.stdout.write(`[${i + 1}/${transformedProducts.length}] Inserting ${product.name}... `);
            
            const success = await insertProduct(product, apiName);
            if (success) {
                console.log('✓');
                successCount++;
            } else {
                console.log('✗');
                failCount++;
            }

            // Small delay to avoid rate limiting
            if (i < transformedProducts.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }

        // Step 7: Summary
        console.log('\n=== Summary ===');
        console.log(`Total products fetched: ${sourceProducts.length}`);
        console.log(`Successfully inserted: ${successCount}`);
        console.log(`Failed: ${failCount}`);
        console.log('\n✓ Seeding complete!');

    } catch (error: any) {
        console.error('\n✗ Fatal error:', error.message);
        process.exit(1);
    }
}

// Run the script
main();

