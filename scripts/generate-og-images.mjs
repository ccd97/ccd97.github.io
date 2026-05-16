import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import satori from 'satori';
import { html } from 'satori-html';
import { Resvg } from '@resvg/resvg-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const maxPngBytes = 150_000;
const pngOutputWidth = 860;

function trace(points, accent, { node = true, nodeR = 1.8 } = {}) {
  const d = `M ${points[0][0]} ${points[0][1]} ` +
    points.slice(1).map(p => `L ${p[0]} ${p[1]}`).join(' ');
  const [ex, ey] = points[points.length - 1];
  const endNode = node ? `<circle cx="${ex}" cy="${ey}" r="${nodeR}" fill="${accent}" stroke="none"/>` : '';
  return `<path d="${d}"/>${endNode}`;
}

function dotGrid(originX, originY, dx, dy, { rows = 6, radius = 1.5 } = {}) {
  let dots = '';
  for (let r = 0; r < rows; r++) {
    const cols = rows - r;
    for (let c = 0; c < cols; c++) {
      dots += `<circle cx="${originX + c * dx}" cy="${originY + r * dy}" r="${radius}"/>`;
    }
  }
  return dots;
}

function buildDecorationSvg(accent) {
  const leftCircuits = [
    [[0, 14], [80, 14], [80, 40], [220, 40], [220, 18], [340, 18], [340, 48], [440, 48]],
    [[0, 64], [110, 64], [110, 92], [260, 92], [260, 70], [400, 70]],
    [[0, 134], [40, 134], [40, 168], [200, 168], [200, 140], [320, 140], [320, 170], [460, 170]],
    [[0, 220], [70, 220], [70, 250], [240, 250], [240, 222], [380, 222]],
    [[0, 296], [50, 296], [50, 330], [180, 330], [180, 300], [340, 300], [340, 332], [480, 332]],
    [[0, 376], [90, 376], [90, 408], [260, 408], [260, 380], [400, 380]],
    [[0, 450], [40, 450], [40, 480], [200, 480], [200, 452], [360, 452], [360, 482], [460, 482]],
    [[0, 530], [70, 530], [70, 560], [240, 560], [240, 532], [380, 532]],
    [[0, 600], [50, 600], [50, 622], [200, 622], [200, 596], [340, 596]],
    [[0, 30], [60, 30], [60, 8], [160, 8]],
    [[0, 102], [90, 102], [90, 124], [180, 124]],
    [[0, 178], [60, 178], [60, 200], [220, 200]],
    [[0, 254], [110, 254], [110, 232], [200, 232]],
    [[0, 332], [70, 332], [70, 356], [180, 356]],
    [[0, 412], [50, 412], [50, 432], [170, 432]],
    [[0, 492], [90, 492], [90, 516], [200, 516]],
    [[0, 568], [60, 568], [60, 588], [180, 588]],
    [[0, 38], [42, 38]],
    [[0, 50], [28, 50]],
    [[0, 76], [56, 76]],
    [[0, 88], [34, 88]],
    [[0, 116], [48, 116]],
    [[0, 148], [30, 148]],
    [[0, 160], [54, 160]],
    [[0, 186], [40, 186]],
    [[0, 204], [62, 204]],
    [[0, 234], [44, 234]],
    [[0, 266], [30, 266]],
    [[0, 278], [56, 278]],
    [[0, 310], [42, 310]],
    [[0, 342], [60, 342]],
    [[0, 360], [32, 360]],
    [[0, 392], [50, 392]],
    [[0, 422], [38, 422]],
    [[0, 438], [62, 438]],
    [[0, 462], [44, 462]],
    [[0, 472], [30, 472]],
    [[0, 506], [52, 506]],
    [[0, 542], [40, 542]],
    [[0, 554], [28, 554]],
    [[0, 578], [60, 578]],
    [[0, 614], [42, 614]],
    [[0, 626], [34, 626]],
    [[80, 40], [80, 16]],
    [[220, 40], [220, 18]],
    [[110, 92], [110, 70]],
    [[260, 92], [260, 70]],
    [[40, 168], [40, 192]],
    [[200, 168], [200, 192]],
    [[320, 140], [320, 170]],
    [[70, 250], [70, 274]],
    [[240, 250], [240, 222]],
    [[50, 330], [50, 354]],
    [[180, 330], [180, 308]],
    [[90, 408], [90, 432]],
    [[260, 408], [260, 380]],
    [[40, 480], [40, 504]],
    [[200, 480], [200, 506]],
    [[70, 560], [70, 584]],
    [[240, 560], [240, 588]],
    [[50, 622], [50, 600]],
    [[200, 622], [200, 600]],
    [[280, 24], [340, 24]],
    [[380, 60], [440, 60]],
    [[300, 110], [380, 110]],
    [[420, 156], [490, 156]],
    [[300, 208], [380, 208]],
    [[400, 264], [470, 264]],
    [[280, 312], [360, 312]],
    [[380, 348], [460, 348]],
    [[300, 392], [380, 392]],
    [[420, 444], [490, 444]],
    [[280, 504], [360, 504]],
    [[380, 552], [460, 552]],
    [[300, 596], [380, 596]],
  ];
  const rightCircuits = leftCircuits.map(pts => pts.map(([x, y]) => [1200 - x, y]));

  const scatterDots = (positions) =>
    positions.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.4"/>`).join('');
  const scatterPositions = [
    [310, 30], [300, 220], [320, 380], [296, 540],
    [890, 30], [900, 220], [880, 380], [904, 540],
  ];

  const codeBox = (tx, ty, w = 56, h = 46, s = 1) => `
    <g transform="translate(${tx}, ${ty})">
      <rect x="0" y="0" width="${w}" height="${h}" rx="${8 * s}"/>
      <polyline points="${20 * s},${14 * s} ${12 * s},${23 * s} ${20 * s},${32 * s}"/>
      <polyline points="${36 * s},${14 * s} ${44 * s},${23 * s} ${36 * s},${32 * s}"/>
      <line x1="${32 * s}" y1="${11 * s}" x2="${24 * s}" y2="${35 * s}"/>
    </g>`;

  const cloud = (tx, ty, s = 1) => `
    <g transform="translate(${tx}, ${ty}) scale(${s})">
      <path d="M 18 32 Q 0 32 4 18 Q 6 8 22 10 Q 28 -2 48 8 Q 68 4 70 22 Q 86 22 84 32 Z"/>
    </g>`;

  const doc = (tx, ty, s = 1) => `
    <g transform="translate(${tx}, ${ty}) scale(${s})">
      <path d="M 0 0 L 38 0 L 52 14 L 52 66 L 0 66 Z"/>
      <polyline points="38,0 38,14 52,14"/>
      <line x1="8" y1="30" x2="44" y2="30"/>
      <line x1="8" y1="42" x2="44" y2="42"/>
      <line x1="8" y1="54" x2="34" y2="54"/>
    </g>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <defs>
      <linearGradient id="sideFadeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stop-color="rgb(255,255,255)"/>
        <stop offset="3%"   stop-color="rgb(255,255,255)"/>
        <stop offset="8%"   stop-color="rgb(200,200,200)"/>
        <stop offset="14%"  stop-color="rgb(120,120,120)"/>
        <stop offset="20%"  stop-color="rgb(40,40,40)"/>
        <stop offset="25%"  stop-color="rgb(0,0,0)"/>
        <stop offset="75%"  stop-color="rgb(0,0,0)"/>
        <stop offset="80%"  stop-color="rgb(40,40,40)"/>
        <stop offset="86%"  stop-color="rgb(120,120,120)"/>
        <stop offset="92%"  stop-color="rgb(200,200,200)"/>
        <stop offset="97%"  stop-color="rgb(255,255,255)"/>
        <stop offset="100%" stop-color="rgb(255,255,255)"/>
      </linearGradient>
      <mask id="sideFadeMask" maskUnits="userSpaceOnUse" x="0" y="0" width="1200" height="630">
        <rect x="0" y="0" width="1200" height="630" fill="url(#sideFadeGradient)"/>
      </mask>
    </defs>

    <g mask="url(#sideFadeMask)" stroke="${accent}" fill="none" stroke-width="0.9" stroke-linecap="round" stroke-linejoin="round">
      <g opacity="0.6">
        ${leftCircuits.map(p => trace(p, accent)).join('\n        ')}
        ${rightCircuits.map(p => trace(p, accent)).join('\n        ')}
      </g>

      <g fill="${accent}" stroke="none" opacity="0.55">
        ${dotGrid(1182, 28, -14, 14, { rows: 7, radius: 1.4 })}
        ${dotGrid(18, 602, 14, -14, { rows: 7, radius: 1.4 })}
        ${dotGrid(18, 28, 14, 14, { rows: 4, radius: 1.3 })}
        ${dotGrid(1182, 602, -14, -14, { rows: 4, radius: 1.3 })}
      </g>

      <g fill="${accent}" stroke="none" opacity="0.4">
        ${scatterDots(scatterPositions)}
      </g>

      <g stroke-width="1.6" opacity="0.6">
        ${codeBox(186, 70)}
        ${cloud(96, 220, 0.78)}
        ${codeBox(120, 380, 44, 36, 0.78)}
        ${cloud(150, 530)}
        ${doc(940, 70)}
        ${codeBox(1024, 220, 44, 36, 0.78)}
        ${cloud(948, 380)}
        ${cloud(1010, 530, 0.78)}
      </g>
    </g>
  </svg>`;
}

async function generateOGImages() {
  const portfolioDataStr = await fs.readFile(path.join(rootDir, 'src/data/portfolio.json'), 'utf8');
  const portfolioData = JSON.parse(portfolioDataStr);
  const name = portfolioData.hero.name;
  const designation = portfolioData.hero.tagline.split('｜')[0].trim();

  const colors = {
    bg: '#fafafa',
    accent: '#1e5bd1',
  };

  const signatureSvgStr = await fs.readFile(path.join(rootDir, 'public/signature.svg'), 'utf8');
  const modifiedSvgStr = signatureSvgStr
    .replace(/stroke="#000"/g, `stroke="${colors.accent}"`)
    .replace(/fill="#000"/g, `fill="${colors.accent}"`)
    .replace('<svg ', '<svg filter="url(#blur)" ')
    .replace('</svg>', '<filter id="blur"><feGaussianBlur stdDeviation="0.001" /></filter></svg>');

  const signatureSrc = "data:image/svg+xml;base64," + Buffer.from(modifiedSvgStr).toString('base64');
  const decorationSrc = "data:image/svg+xml;base64," + Buffer.from(buildDecorationSvg(colors.accent)).toString('base64');

  console.log('Fetching font...');
  const fontRes = await fetch('https://raw.githubusercontent.com/googlefonts/roboto/main/src/hinted/Roboto-Regular.ttf');
  const fontData = await fontRes.arrayBuffer();

  const fontBoldRes = await fetch('https://raw.githubusercontent.com/googlefonts/roboto/main/src/hinted/Roboto-Bold.ttf');
  const fontBoldData = await fontBoldRes.arrayBuffer();

  const createLayout = (typeText) => {
    return html`
      <div style="display: flex; flex-direction: column; width: 100%; height: 100%; background-color: #ffffff; font-family: 'Roboto'; position: relative;">
        <img src="${decorationSrc}" style="position: absolute; left: 0; top: 0; width: 1200px; height: 630px;" />
        <img src="${signatureSrc}" style="position: absolute; left: 290px; top: -48px; width: 620px; height: 620px; object-fit: contain; opacity: 0.16;" />

        <div style="display: flex; height: 16px; width: 100%; background-color: ${colors.accent};"></div>

        <div style="display: flex; flex: 1; padding: 64px 100px 54px; justify-content: center; align-items: flex-end;">
          <div style="display: flex; flex-direction: column; align-items: center; text-align: center; width: 630px;">
            <div style="display: flex; justify-content: center; margin-bottom: 14px;">
              <div style="display: flex; padding: 7px 16px; background-color: rgba(232, 240, 255, 0.88); color: ${colors.accent}; border: 1.5px solid ${colors.accent}; border-radius: 11px; font-size: 18px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;">
                ${typeText}
              </div>
            </div>

            <div style="display: flex; justify-content: center; text-align: center; font-size: 64px; font-weight: 700; color: #111827; line-height: 1.05; margin-bottom: 12px; letter-spacing: -0.02em;">
              ${name}
            </div>

            <div style="display: flex; justify-content: center; text-align: center; font-size: 28px; color: #4b5563; font-weight: 400; line-height: 1.35;">
              ${designation}
            </div>
          </div>
        </div>
      </div>
    `;
  };

  for (const type of ['Portfolio', 'Resume']) {
    console.log(`Generating ${type} OG image...`);
    const svg = await satori(createLayout(type), {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Roboto',
          data: fontData,
          weight: 400,
          style: 'normal',
        },
        {
          name: 'Roboto',
          data: fontBoldData,
          weight: 700,
          style: 'normal',
        }
      ],
    });

    const fileName = `og-${type.toLowerCase()}`;
    const svgPath = path.join(rootDir, `public/media/${fileName}.svg`);
    await fs.writeFile(svgPath, svg);

    const resvg = new Resvg(svg, {
      background: colors.bg,
      fitTo: {
        mode: 'width',
        value: pngOutputWidth,
      },
    });
    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();
    const pngPath = path.join(rootDir, `public/media/${fileName}.png`);
    await fs.writeFile(pngPath, pngBuffer);
    console.log(`${fileName}.png: ${Math.round(pngBuffer.byteLength / 1024)}KB`);

    if (pngBuffer.byteLength > maxPngBytes) {
      throw new Error(`${fileName}.png is ${pngBuffer.byteLength} bytes, expected <= ${maxPngBytes} bytes`);
    }
  }
  
  console.log('Images generated successfully.');
}

generateOGImages().catch(err => {
  console.error(err);
  process.exit(1);
});
