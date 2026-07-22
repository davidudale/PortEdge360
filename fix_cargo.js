const fs = require("fs");
const path = require("path");
const f = path.join(process.cwd(), "app/dashboard/[role]/components/CargoDetailsForm.tsx");
let c = fs.readFileSync(f, "utf8");

// Look for the broken section around the last input
const searchStr = 'onChange={(ev) => updateEntry(index, "billOfLading", ev.target.value)}';
const idx = c.indexOf(searchStr);
if (idx === -1) {
  console.log("Search string not found");
  process.exit(1);
}

// Find the position after the last input to reconstruct
const afterInput = idx + searchStr.length;
const remaining = c.substring(afterInput);

// The pattern is: \r\n\r\n      ))}\r\n\r\n      <div ...
// We need to replace with proper closing: />\n            </label>\n          </div>\n        </div>\n      ))}
const replacement = "\r\n              />\r\n            </label>\r\n          </div>\r\n        </div>\r\n      ))}";

// Find the first occurrence of ))} after "billOfLading"
const closeParensIdx = remaining.indexOf(")})");
if (closeParensIdx === -1) {
  console.log("Could not find )}) in remaining");
  process.exit(1);
}

// Take everything from ))} onwards
const afterClose = remaining.substring(closeParensIdx + 3);
c = c.substring(0, afterInput) + replacement + afterClose;

fs.writeFileSync(f, c, "utf8");
console.log("Fixed!");

// Verify
const c2 = fs.readFileSync(f, "utf8");
const opens = (c2.match(/<div/g) || []).length;
const closes = (c2.match(/<\/div>/g) || []).length;
console.log(`<div opens: ${opens}, </div> closes: ${closes}`);
console.log(opens === closes ? "BALANCED" : "MISMATCH!");
