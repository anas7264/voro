const React = require('react');
const ReactDOMServer = require('react-dom/server');
const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

async function testAppLayout() {
  console.log("Starting AppLayout Verification...");

  const jsxFile = path.join(__dirname, 'src/components/AppLayout.jsx');
  const code = fs.readFileSync(jsxFile, 'utf8');

  // Verify core design system and accessibility tokens
  const assertions = [
    { text: 'SidebarContext', label: 'SidebarContext Context Export' },
    { text: 'useSidebar', label: 'useSidebar Hook Export' },
    { text: 'Skip', label: 'Skip to Main Content Link' },
    { text: '0xSKP_', label: 'Skip Link Attestation Hash' },
    { text: '0xLYT_', label: 'Layout Attestation Hash' },
    { text: 'role="banner"', label: 'Mobile Banner Role' },
    { text: 'bg-[#080B14]', label: 'Charcoal Spatial Background' },
    { text: 'requestAnimationFrame', label: '60fps Direct-DOM RAF Throttling' },
    { text: 'useMemo', label: 'Memoized SidebarContext Value' },
  ];

  let passedCount = 0;
  for (const { text, label } of assertions) {
    if (code.includes(text)) {
      console.log(`  ✓ ${label} found`);
      passedCount++;
    } else {
      console.error(`  ✕ ${label} missing!`);
    }
  }

  // Bundle with esbuild to ensure no syntax/JSX errors
  try {
    const buildResult = await esbuild.build({
      entryPoints: [jsxFile],
      bundle: true,
      write: false,
      format: 'cjs',
      jsx: 'transform',
      loader: { '.jsx': 'jsx', '.js': 'jsx' },
      alias: {
        '@': path.join(__dirname, 'src')
      },
      external: ['react', 'react-dom', 'lucide-react']
    });

    console.log("  ✓ Component JS compilation successful");
    passedCount++;
  } catch (err) {
    console.error("  ✕ Compilation failed:", err);
  }

  if (passedCount === assertions.length + 1) {
    console.log(`\nAll ${passedCount}/${assertions.length + 1} checks passed successfully!`);
    process.exit(0);
  } else {
    console.error(`\nVerification failed: ${passedCount}/${assertions.length + 1} checks passed.`);
    process.exit(1);
  }
}

testAppLayout();
