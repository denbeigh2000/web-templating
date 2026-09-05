#!/usr/bin/env node
// Conformance lint: component CSS must consume semantic tokens from
// src/styles/tokens.css only — no raw colour values (hex, rgb(), hsl(),
// oklch(), light-dark(), or named CSS colours).
//
// The token layer itself (src/styles/) is the only place raw values live;
// this script deliberately does not scan it.

'use strict';

const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = path.join(__dirname, '..', 'src', 'components');

// Each rule is a regex over a single line of CSS.
const RULES = [
    { name: 'hex colour', pattern: /#[0-9a-f]{3,8}\b/i },
    { name: 'rgb()/rgba()', pattern: /\brgba?\(/i },
    { name: 'hsl()/hsla()', pattern: /\bhsla?\(/i },
    { name: 'oklch()/oklab()', pattern: /\boklch\(|\boklab\(/i },
    { name: 'lab()/lch()', pattern: /\blab\(|\blch\(/i },
    { name: 'color() function', pattern: /\bcolor\(/i },
    { name: 'light-dark()', pattern: /\blight-dark\(/i },
    {
        name: 'named colour',
        // alphanumeric-prefixed ident must not be swallowed: require a word
        // boundary that isn't a hyphen (so --accent-blue doesn't match).
        pattern: new RegExp(
            '(?<![\\w-])(' +
                [
                    'transparent', 'currentcolor', 'aliceblue', 'antiquewhite', 'aqua', 'aquamarine',
                    'azure', 'beige', 'bisque', 'black', 'blanchedalmond', 'blue', 'blueviolet',
                    'brown', 'burlywood', 'cadetblue', 'chartreuse', 'chocolate', 'coral',
                    'cornflowerblue', 'cornsilk', 'crimson', 'cyan', 'darkblue', 'darkcyan',
                    'darkgoldenrod', 'darkgray', 'darkgreen', 'darkgrey', 'darkkhaki',
                    'darkmagenta', 'darkolivegreen', 'darkorange', 'darkorchid', 'darkred',
                    'darksalmon', 'darkseagreen', 'darkslateblue', 'darkslategray',
                    'darkslategrey', 'darkturquoise', 'darkviolet', 'deeppink', 'deepskyblue',
                    'dimgray', 'dimgrey', 'dodgerblue', 'firebrick', 'floralwhite', 'forestgreen',
                    'fuchsia', 'gainsboro', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'green',
                    'greenyellow', 'grey', 'honeydew', 'hotpink', 'indianred', 'indigo', 'ivory',
                    'khaki', 'lavender', 'lavenderblush', 'lawngreen', 'lemonchiffon',
                    'lightblue', 'lightcoral', 'lightcyan', 'lightgoldenrodyellow',
                    'lightgray', 'lightgreen', 'lightgrey', 'lightpink', 'lightsalmon',
                    'lightseagreen', 'lightskyblue', 'lightslategray', 'lightslategrey',
                    'lightsteelblue', 'lightyellow', 'lime', 'limegreen', 'linen', 'magenta',
                    'maroon', 'mediumaquamarine', 'mediumblue', 'mediumorchid', 'mediumpurple',
                    'mediumseagreen', 'mediumslateblue', 'mediumspringgreen', 'mediumturquoise',
                    'mediumvioletred', 'midnightblue', 'mintcream', 'mistyrose', 'moccasin',
                    'navajowhite', 'navy', 'oldlace', 'olive', 'olivedrab', 'orange',
                    'orangered', 'orchid', 'palegoldenrod', 'palegreen', 'paleturquoise',
                    'palevioletred', 'papayawhip', 'peachpuff', 'peru', 'pink', 'plum',
                    'powderblue', 'purple', 'rebeccapurple', 'red', 'rosybrown', 'royalblue',
                    'saddlebrown', 'salmon', 'sandybrown', 'seagreen', 'seashell', 'sienna',
                    'silver', 'skyblue', 'slateblue', 'slategray', 'slategrey', 'snow',
                    'springgreen', 'steelblue', 'tan', 'teal', 'thistle', 'tomato', 'turquoise',
                    'violet', 'wheat', 'white', 'whitesmoke', 'yellow', 'yellowgreen',
                ].join('|') +
                ')(?![\\w-])',
            'i'
        ),
    },
];

function findCssFiles(dir) {
    if (!fs.existsSync(dir)) return [];
    const out = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            out.push(...findCssFiles(full));
        } else if (entry.isFile() && entry.name.endsWith('.css')) {
            out.push(full);
        }
    }
    return out;
}

const violations = [];
const cssFiles = findCssFiles(COMPONENTS_DIR);

for (const file of cssFiles) {
    const rel = path.relative(process.cwd(), file);
    const lines = fs.readFileSync(file, 'utf8').split('\n');
    lines.forEach((line, i) => {
        for (const rule of RULES) {
            const m = line.match(rule.pattern);
            if (m) {
                violations.push(
                    `${rel}:${i + 1}: ${rule.name} ("${m[0]}") — use a semantic token from tokens.css instead`
                );
            }
        }
    });
}

if (violations.length > 0) {
    console.error(`\n✗ ${violations.length} raw colour value(s) in component CSS:\n`);
    for (const v of violations) console.error(`  ${v}`);
    console.error(
        '\nComponent CSS must consume semantic tokens from src/styles/tokens.css only.'
    );
    console.error('Derived variants (hover/active/disabled) belong in the token layer via color-mix().\n');
    process.exit(1);
}

console.log(
    `✓ check-tokens: ${cssFiles.length} component stylesheet(s) scanned, ` +
        `${RULES.length} rules, no raw colour values found.`
);
