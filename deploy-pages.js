#!/usr/bin/env node

/**
 * Deploy to Cloudflare Pages using the API
 * 
 * Usage:
 *   node deploy-pages.js
 * 
 * Required environment variables:
 *   CLOUDFLARE_API_TOKEN - Your Cloudflare API token with Pages:Edit permissions
 *   CLOUDFLARE_ACCOUNT_ID - Your Cloudflare account ID
 * 
 * Optional environment variables:
 *   CLOUDFLARE_PROJECT_NAME - Project name (default: evd-site)
 *   CLOUDFLARE_BRANCH - Branch name (default: production)
 */

import { readFileSync, unlinkSync, existsSync, rmSync, mkdirSync, copyFileSync, writeFileSync } from 'fs';
import { readdir, stat } from 'fs/promises';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { execSync } from 'child_process';
import { createHash } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const API_BASE = 'https://api.cloudflare.com/client/v4';
const PROJECT_NAME = process.env.CLOUDFLARE_PROJECT_NAME || 'evd-site';
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const BRANCH = process.env.CLOUDFLARE_BRANCH || 'production';

if (!ACCOUNT_ID || !API_TOKEN) {
  console.error('❌ Error: CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN must be set');
  process.exit(1);
}

async function makeRequest(method, endpoint, body = null, headers = {}) {
  const url = `${API_BASE}${endpoint}`;
  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      ...headers
    }
  };

  if (body) {
    if (body instanceof FormData) {
      options.body = body;
      // Remove Content-Type header to let FormData set it with boundary
      delete options.headers['Content-Type'];
    } else {
      options.body = JSON.stringify(body);
      options.headers['Content-Type'] = 'application/json';
    }
  }

  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}\n${JSON.stringify(data, null, 2)}`);
  }

  return data;
}

async function getAllFiles(dir, baseDir = dir) {
  const files = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    const relativePath = relative(baseDir, fullPath);

    if (entry.isDirectory()) {
      const subFiles = await getAllFiles(fullPath, baseDir);
      files.push(...subFiles);
    } else {
      files.push({ path: relativePath, fullPath });
    }
  }

  return files;
}

async function ensureProjectExists() {
  console.log('🔍 Checking if project exists...');
  
  try {
    const result = await makeRequest(
      'GET',
      `/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT_NAME}`
    );
    
    if (result.success && result.result) {
      console.log('✅ Project exists\n');
      return true;
    }
  } catch (error) {
    if (error.message.includes('404') || error.message.includes('not found')) {
      console.log('📝 Project not found. Creating new project...');
      
      try {
        const createResult = await makeRequest(
          'POST',
          `/accounts/${ACCOUNT_ID}/pages/projects`,
          {
            name: PROJECT_NAME,
            production_branch: 'main'
          }
        );
        
        if (createResult.success) {
          console.log('✅ Project created successfully\n');
          return true;
        } else {
          throw new Error('Failed to create project: ' + JSON.stringify(createResult.errors, null, 2));
        }
      } catch (createError) {
        console.error('❌ Failed to create project:');
        console.error(createError.message);
        console.error('\n💡 Please create the project manually in Cloudflare Dashboard:');
        console.error(`   https://dash.cloudflare.com/${ACCOUNT_ID}/pages/new`);
        throw createError;
      }
    } else {
      throw error;
    }
  }
  
  return false;
}

async function createDeployment() {
  console.log('🚀 Starting Cloudflare Pages deployment...\n');

  // Ensure project exists first
  await ensureProjectExists();

  const buildDir = join(__dirname, '.svelte-kit', 'cloudflare');
  const clientDir = join(buildDir, 'client');
  const workerFile = join(buildDir, 'worker.js');
  
  try {
    await stat(buildDir);
    await stat(clientDir);
    await stat(workerFile);
  } catch (error) {
    console.error(`❌ Build directory not found: ${buildDir}`);
    console.error('   Please run "npm run build" first');
    process.exit(1);
  }

  console.log('📦 Preparing files for Cloudflare Pages...');
  console.log('   Restructuring build output for Pages format...\n');

  // For Cloudflare Pages, we need:
  // 1. All client files at the root
  // 2. worker.js renamed to _worker.js at the root
  // 3. output/ and cloudflare-tmp/ directories for worker imports
  
  const files = [];
  
  // Get all client files (these go to root)
  const clientFiles = await getAllFiles(clientDir, clientDir);
  for (const file of clientFiles) {
    files.push({
      path: file.path, // Already relative to clientDir
      fullPath: file.fullPath
    });
  }
  
  // Add worker.js as _worker.js at root
  files.push({
    path: '_worker.js',
    fullPath: workerFile
  });
  
  // Add output directory (needed for worker imports)
  const outputDir = join(__dirname, '.svelte-kit', 'output');
  if (existsSync(outputDir)) {
    const outputFiles = await getAllFiles(outputDir, outputDir);
    for (const file of outputFiles) {
      files.push({
        path: `output/${file.path}`,
        fullPath: file.fullPath
      });
    }
  }
  
  // Add cloudflare-tmp directory (needed for manifest)
  const cloudflareTmpDir = join(__dirname, '.svelte-kit', 'cloudflare-tmp');
  if (existsSync(cloudflareTmpDir)) {
    const tmpFiles = await getAllFiles(cloudflareTmpDir, cloudflareTmpDir);
    for (const file of tmpFiles) {
      files.push({
        path: `cloudflare-tmp/${file.path}`,
        fullPath: file.fullPath
      });
    }
  }
  
  console.log(`   Found ${files.length} files to deploy\n`);

  // Create a zip file for more reliable upload
  // We need to create a temp directory with the correct structure first
  const tempDir = join(__dirname, '.svelte-kit', 'pages-deploy-temp');
  const zipPath = join(__dirname, '.svelte-kit', 'cloudflare-deploy.zip');
  
  console.log('📦 Creating deployment package...');
  
  try {
    // Clean up temp directory if it exists
    if (existsSync(tempDir)) {
      rmSync(tempDir, { recursive: true, force: true });
    }
    mkdirSync(tempDir, { recursive: true });
    
    // Copy all files to temp directory maintaining structure
    for (const file of files) {
      const destPath = join(tempDir, file.path);
      const destDir = dirname(destPath);
      if (!existsSync(destDir)) {
        mkdirSync(destDir, { recursive: true });
      }
      copyFileSync(file.fullPath, destPath);
    }
    
    // Fix worker.js import paths (change ../output to ./output and ../cloudflare-tmp to ./cloudflare-tmp)
    const workerDestPath = join(tempDir, '_worker.js');
    if (existsSync(workerDestPath)) {
      let workerContent = readFileSync(workerDestPath, 'utf-8');
      // Replace relative imports to be relative to root
      workerContent = workerContent.replace(/from\s+["']\.\.\/output\//g, 'from "./output/');
      workerContent = workerContent.replace(/from\s+["']\.\.\/cloudflare-tmp\//g, 'from "./cloudflare-tmp/');
      writeFileSync(workerDestPath, workerContent, 'utf-8');
      console.log('   ✓ Fixed worker.js import paths');
    }
    
    // Ensure index.html exists at root (required by Cloudflare Pages)
    const indexHtmlPath = join(tempDir, 'index.html');
    if (!existsSync(indexHtmlPath)) {
      // If index.html wasn't in client files, check static directory
      const staticIndexHtml = join(__dirname, 'static', 'index.html');
      if (existsSync(staticIndexHtml)) {
        copyFileSync(staticIndexHtml, indexHtmlPath);
        console.log('   ✓ Added index.html from static directory');
      } else {
        // Create a minimal index.html as fallback
        const minimalHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Eco Volt Dynamics | Solar & Backup Power Solutions</title>
</head>
<body>
  <div id="app"></div>
  <noscript>Please enable JavaScript to view this site.</noscript>
</body>
</html>`;
        writeFileSync(indexHtmlPath, minimalHtml);
        console.log('   ✓ Created minimal index.html');
      }
    } else {
      console.log('   ✓ index.html found in build output');
    }
    
    // Copy worker.js as _worker.js
    copyFileSync(workerFile, join(tempDir, '_worker.js'));
    
    // Create zip from temp directory
    const zipCommand = process.platform === 'win32' 
      ? `powershell -Command "Compress-Archive -Path '${tempDir}\\*' -DestinationPath '${zipPath}' -Force"`
      : `cd ${tempDir} && zip -r ${zipPath} .`;
    
    execSync(zipCommand, { stdio: 'inherit' });
    
    // Clean up temp directory
    rmSync(tempDir, { recursive: true, force: true });
    
    console.log('✅ Package created\n');
  } catch (error) {
    console.error('❌ Failed to create zip file. Trying alternative method...\n');
    // Fallback: try to upload files directly
    const formData = new FormData();
    for (const file of files) {
      const fileBuffer = readFileSync(file.fullPath);
      const blob = new Blob([fileBuffer]);
      formData.append('file', blob, file.path);
    }
    return await uploadFormData(formData, zipPath);
  }

  // Create manifest for Cloudflare Pages API
  console.log('📋 Creating deployment manifest...');
  const manifest = {
    files: {}
  };
  
  for (const file of files) {
    const fileBuffer = readFileSync(file.fullPath);
    const hash = createHash('sha256').update(fileBuffer).digest('hex');
    manifest.files[file.path.replace(/\\/g, '/')] = {
      version: hash,
      size: fileBuffer.length
    };
  }
  
  // Upload zip file with manifest
  console.log('📤 Uploading package to Cloudflare Pages...');
  
  const zipBuffer = readFileSync(zipPath);
  const formData = new FormData();
  const blob = new Blob([zipBuffer], { type: 'application/zip' });
  formData.append('file', blob, 'deployment.zip');
  formData.append('manifest', JSON.stringify(manifest));
  
  await uploadFormData(formData, zipPath);
}

async function uploadFormData(formData, zipPath) {
  try {
    const result = await makeRequest(
      'POST',
      `/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT_NAME}/deployments`,
      formData,
      {}
    );

    if (result.success) {
      const deployment = result.result;
      console.log('\n✅ Deployment successful!');
      console.log(`   Deployment ID: ${deployment.id}`);
      console.log(`   URL: ${deployment.url || deployment.alias || 'Check Cloudflare Dashboard'}`);
      console.log(`   Environment: ${deployment.environment || BRANCH}`);
      if (deployment.deployment_trigger) {
        console.log(`   Triggered by: ${deployment.deployment_trigger.type}`);
      }
    } else {
      throw new Error('Deployment failed: ' + JSON.stringify(result.errors, null, 2));
    }
  } catch (error) {
    console.error('\n❌ Deployment failed:');
    console.error(error.message);
    throw error;
  } finally {
    // Clean up zip file
    try {
      if (zipPath && existsSync(zipPath)) {
        unlinkSync(zipPath);
        console.log('\n🧹 Cleaned up temporary files');
      }
    } catch (err) {
      // Ignore cleanup errors
    }
  }
}

// Run deployment
createDeployment().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

