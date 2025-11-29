import { Amplify } from 'aws-amplify';
import { signIn, fetchAuthSession } from 'aws-amplify/auth';
import { post } from 'aws-amplify/api';
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

// Load products from JSON file
function loadProductsFromFile(): IProduct[] {
    const productsPath = path.join(process.cwd(), 'app', 'scripts', 'products.json');
    try {
        const fileContent = fs.readFileSync(productsPath, 'utf-8');
        const products = JSON.parse(fileContent) as IProduct[];
        return products;
    } catch (error: any) {
        console.error(`✗ Failed to load products from ${productsPath}:`, error.message);
        throw error;
    }
}

// Terminal input helper
function question(rl: readline.Interface, query: string): Promise<string> {
    return new Promise(resolve => rl.question(query, resolve));
}

// Password input (visible for cross-platform compatibility)
// Note: Password will be visible as you type
function questionPassword(rl: readline.Interface, query: string): Promise<string> {
    return question(rl, query);
}

async function authenticateAndVerifyAdmin(): Promise<boolean> {
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

        if (!result.isSignedIn) {
            console.error('✗ Authentication failed. Please check your credentials.');
            return false;
        }

        console.log('✓ Authentication successful!');
        console.log('Verifying admin access...');

        // Fetch auth session to get user groups
        const session = await fetchAuthSession();
        const groups = session.tokens?.accessToken?.payload['cognito:groups'] as string[] || [];

        if (!groups.includes('Admin')) {
            console.error('✗ Access denied. You must be an Admin to perform this operation.');
            console.error(`  Your groups: ${groups.length > 0 ? groups.join(', ') : 'none'}`);
            return false;
        }

        console.log('✓ Admin access verified!\n');
        return true;
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
                } as any
            }
        }).response;

        const response = await operation.body.json() as any;
        return response?.success || false;
    } catch (error: any) {
        console.error(`  Error inserting product ${product.name}:`, error.message);
        return false;
    }
}

async function main() {
    try {
        // Step 1: Authenticate and verify admin status
        const authenticated = await authenticateAndVerifyAdmin();
        if (!authenticated) {
            process.exit(1);
        }

        // Step 2: Get API name from environment or config
        const apiName = process.env.API_NAME || 'BarelyGoldAPI';
        console.log(`Using API: ${apiName}\n`);

        // Step 3: Load products from JSON file
        console.log('Loading products from JSON file...');
        const products = loadProductsFromFile();
        console.log(`Found ${products.length} products to insert\n`);

        // Step 4: Insert products into database
        console.log('Inserting products into database...');
        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            process.stdout.write(`[${i + 1}/${products.length}] Inserting ${product.name}... `);
            
            const success = await insertProduct(product, apiName);
            if (success) {
                console.log('✓');
                successCount++;
            } else {
                console.log('✗');
                failCount++;
            }

            // Small delay to avoid rate limiting
            if (i < products.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }

        // Step 5: Summary
        console.log('\n=== Summary ===');
        console.log(`Total products: ${products.length}`);
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
