/*
 * QR Code encoder (ISO/IEC 18004), byte mode at error correction level M, versions 1 to 6: enough for a store URL
 * (up to 106 bytes) without the version-information blocks that versions 7+ need. Runs at build time only, so the
 * page ships a finished SVG and no script. Follows the structure of Project Nayuki's reference encoder.
 */

/** Level M per version: error-correction codewords per block and the number of blocks (all blocks equal up to v6). */
const LEVEL_M: Record<number, { ecPerBlock: number; blocks: number }> = {
  1: { ecPerBlock: 10, blocks: 1 },
  2: { ecPerBlock: 16, blocks: 1 },
  3: { ecPerBlock: 26, blocks: 1 },
  4: { ecPerBlock: 18, blocks: 2 },
  5: { ecPerBlock: 24, blocks: 2 },
  6: { ecPerBlock: 16, blocks: 4 },
};

const ALIGNMENT: Record<number, number[]> = { 1: [], 2: [6, 18], 3: [6, 22], 4: [6, 26], 5: [6, 30], 6: [6, 34] };

/** Format bits of level M (the standard's "00"). */
const LEVEL_M_BITS = 0;

const MASKS: ((x: number, y: number) => boolean)[] = [
  (x, y) => (x + y) % 2 === 0,
  (_x, y) => y % 2 === 0,
  (x) => x % 3 === 0,
  (x, y) => (x + y) % 3 === 0,
  (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0,
  (x, y) => ((x * y) % 2) + ((x * y) % 3) === 0,
  (x, y) => (((x * y) % 2) + ((x * y) % 3)) % 2 === 0,
  (x, y) => (((x + y) % 2) + ((x * y) % 3)) % 2 === 0,
];

const sizeOf = (version: number) => version * 4 + 17;

/** Raw codewords of a version (data and error correction), from the count of data modules. */
function rawCodewords(version: number): number {
  let modules = (16 * version + 128) * version + 64;
  if (version >= 2) {
    const align = Math.floor(version / 7) + 2;
    modules -= (25 * align - 10) * align - 55;
  }
  return Math.floor(modules / 8);
}

const dataCodewords = (version: number) => rawCodewords(version) - LEVEL_M[version].ecPerBlock * LEVEL_M[version].blocks;

/* ---------- Reed-Solomon over GF(2^8), polynomial 0x11D ---------- */

function gfMultiply(x: number, y: number): number {
  let z = 0;
  for (let i = 7; i >= 0; i--) {
    z = (z << 1) ^ ((z >>> 7) * 0x11d);
    z ^= ((y >>> i) & 1) * x;
  }
  return z;
}

function rsDivisor(degree: number): number[] {
  const result = new Array<number>(degree).fill(0);
  result[degree - 1] = 1;
  let root = 1;
  for (let i = 0; i < degree; i++) {
    for (let j = 0; j < result.length; j++) {
      result[j] = gfMultiply(result[j], root);
      if (j + 1 < result.length) result[j] ^= result[j + 1];
    }
    root = gfMultiply(root, 0x02);
  }
  return result;
}

function rsRemainder(data: number[], divisor: number[]): number[] {
  const result = divisor.map(() => 0);
  for (const byte of data) {
    const factor = byte ^ (result.shift() as number);
    result.push(0);
    divisor.forEach((coefficient, i) => (result[i] ^= gfMultiply(coefficient, factor)));
  }
  return result;
}

/* ---------- Codewords ---------- */

function encodeData(bytes: Uint8Array, version: number): number[] {
  const capacity = dataCodewords(version) * 8;
  const bits: number[] = [];
  const push = (value: number, length: number) => {
    for (let i = length - 1; i >= 0; i--) bits.push((value >>> i) & 1);
  };
  push(0b0100, 4); // byte mode
  push(bytes.length, 8); // character count, 8 bits up to version 9
  bytes.forEach((byte) => push(byte, 8));
  push(0, Math.min(4, capacity - bits.length)); // terminator
  push(0, (8 - (bits.length % 8)) % 8);
  for (let pad = 0xec; bits.length < capacity; pad ^= 0xec ^ 0x11) push(pad, 8);

  const codewords: number[] = [];
  for (let i = 0; i < bits.length; i += 8) codewords.push(bits.slice(i, i + 8).reduce((byte, bit) => (byte << 1) | bit, 0));
  return codewords;
}

function addErrorCorrection(data: number[], version: number): number[] {
  const { ecPerBlock, blocks } = LEVEL_M[version];
  const perBlock = data.length / blocks;
  const divisor = rsDivisor(ecPerBlock);
  const dataBlocks = Array.from({ length: blocks }, (_, b) => data.slice(b * perBlock, (b + 1) * perBlock));
  const ecBlocks = dataBlocks.map((block) => rsRemainder(block, divisor));
  const result: number[] = [];
  for (let i = 0; i < perBlock; i++) dataBlocks.forEach((block) => result.push(block[i]));
  for (let i = 0; i < ecPerBlock; i++) ecBlocks.forEach((block) => result.push(block[i]));
  return result;
}

/* ---------- Matrix ---------- */

class Matrix {
  readonly size: number;
  readonly modules: boolean[][];
  readonly reserved: boolean[][];

  constructor(size: number) {
    this.size = size;
    this.modules = Array.from({ length: size }, () => new Array<boolean>(size).fill(false));
    this.reserved = Array.from({ length: size }, () => new Array<boolean>(size).fill(false));
  }

  setFunction(x: number, y: number, dark: boolean) {
    this.modules[y][x] = dark;
    this.reserved[y][x] = true;
  }
}

function drawFunctionPatterns(matrix: Matrix, version: number) {
  const { size } = matrix;
  for (let i = 0; i < size; i++) {
    matrix.setFunction(6, i, i % 2 === 0);
    matrix.setFunction(i, 6, i % 2 === 0);
  }
  for (const [cx, cy] of [
    [3, 3],
    [size - 4, 3],
    [3, size - 4],
  ]) {
    for (let dy = -4; dy <= 4; dy++) {
      for (let dx = -4; dx <= 4; dx++) {
        const x = cx + dx;
        const y = cy + dy;
        const distance = Math.max(Math.abs(dx), Math.abs(dy));
        if (x >= 0 && x < size && y >= 0 && y < size) matrix.setFunction(x, y, distance !== 2 && distance !== 4);
      }
    }
  }
  const positions = ALIGNMENT[version];
  const last = positions.length - 1;
  positions.forEach((cx, i) =>
    positions.forEach((cy, j) => {
      if ((i === 0 && j === 0) || (i === 0 && j === last) || (i === last && j === 0)) return;
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) matrix.setFunction(cx + dx, cy + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
      }
    }),
  );
  drawFormatBits(matrix, 0); // reserves the format areas; redrawn once the mask is chosen
}

function drawFormatBits(matrix: Matrix, mask: number) {
  const { size } = matrix;
  const data = (LEVEL_M_BITS << 3) | mask;
  let remainder = data;
  for (let i = 0; i < 10; i++) remainder = (remainder << 1) ^ ((remainder >>> 9) * 0x537);
  const bits = ((data << 10) | remainder) ^ 0x5412;
  const bit = (i: number) => ((bits >>> i) & 1) === 1;

  for (let i = 0; i <= 5; i++) matrix.setFunction(8, i, bit(i));
  matrix.setFunction(8, 7, bit(6));
  matrix.setFunction(8, 8, bit(7));
  matrix.setFunction(7, 8, bit(8));
  for (let i = 9; i < 15; i++) matrix.setFunction(14 - i, 8, bit(i));
  for (let i = 0; i < 8; i++) matrix.setFunction(size - 1 - i, 8, bit(i));
  for (let i = 8; i < 15; i++) matrix.setFunction(8, size - 15 + i, bit(i));
  matrix.setFunction(8, size - 8, true); // the dark module
}

function drawCodewords(matrix: Matrix, codewords: number[]) {
  const { size } = matrix;
  let i = 0;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vertical = 0; vertical < size; vertical++) {
      for (let j = 0; j < 2; j++) {
        const x = right - j;
        const upward = ((right + 1) & 2) === 0;
        const y = upward ? size - 1 - vertical : vertical;
        if (!matrix.reserved[y][x] && i < codewords.length * 8) {
          matrix.modules[y][x] = ((codewords[i >>> 3] >>> (7 - (i & 7))) & 1) === 1;
          i++;
        }
      }
    }
  }
}

function applyMask(matrix: Matrix, mask: number) {
  for (let y = 0; y < matrix.size; y++) {
    for (let x = 0; x < matrix.size; x++) {
      if (!matrix.reserved[y][x] && MASKS[mask](x, y)) matrix.modules[y][x] = !matrix.modules[y][x];
    }
  }
}

/** The standard's four penalty rules; the mask with the lowest score is used. */
function penalty(modules: boolean[][]): number {
  const size = modules.length;
  let score = 0;
  const lines = [...modules, ...modules[0].map((_, x) => modules.map((row) => row[x]))];
  for (const line of lines) {
    let run = 1;
    for (let i = 1; i <= size; i++) {
      if (i < size && line[i] === line[i - 1]) {
        run++;
      } else {
        if (run >= 5) score += run - 2;
        run = 1;
      }
    }
    // Light quiet zone on both ends, as a scanner sees it.
    const text = `0000${line.map((dark) => (dark ? "1" : "0")).join("")}0000`;
    for (let i = 0; i + 11 <= text.length; i++) {
      const slice = text.slice(i, i + 11);
      if (slice === "10111010000" || slice === "00001011101") score += 40;
    }
  }
  for (let y = 0; y < size - 1; y++) {
    for (let x = 0; x < size - 1; x++) {
      const dark = modules[y][x];
      if (dark === modules[y][x + 1] && dark === modules[y + 1][x] && dark === modules[y + 1][x + 1]) score += 3;
    }
  }
  const darkCount = modules.flat().filter(Boolean).length;
  const total = size * size;
  score += (Math.ceil(Math.abs(darkCount * 20 - total * 10) / total) - 1) * 10;
  return score;
}

/** The QR Code of `text` (UTF-8, byte mode, level M) as rows of modules, `true` for dark. No quiet zone. */
export function qrCode(text: string): boolean[][] {
  const bytes = new TextEncoder().encode(text);
  const version = Object.keys(LEVEL_M)
    .map(Number)
    .find((v) => 4 + 8 + bytes.length * 8 <= dataCodewords(v) * 8);
  if (version === undefined) throw new Error(`qrCode: ${bytes.length} bytes do not fit in version 6 at level M`);

  const codewords = addErrorCorrection(encodeData(bytes, version), version);
  let best: { score: number; modules: boolean[][] } | undefined;
  for (let mask = 0; mask < MASKS.length; mask++) {
    const matrix = new Matrix(sizeOf(version));
    drawFunctionPatterns(matrix, version);
    drawCodewords(matrix, codewords);
    applyMask(matrix, mask);
    drawFormatBits(matrix, mask);
    const score = penalty(matrix.modules);
    if (!best || score < best.score) best = { score, modules: matrix.modules };
  }
  return (best as { modules: boolean[][] }).modules;
}

/**
 * SVG path of the dark modules, one rectangle per horizontal run, offset by `margin` modules (the quiet zone).
 * Draw it in a `viewBox` of `0 0 size+2*margin size+2*margin`.
 */
export function qrPath(modules: boolean[][], margin: number): string {
  const parts: string[] = [];
  modules.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      if (!row[x]) continue;
      let run = 1;
      while (x + run < row.length && row[x + run]) run++;
      parts.push(`M${x + margin} ${y + margin}h${run}v1h-${run}z`);
      x += run - 1;
    }
  });
  return parts.join("");
}
