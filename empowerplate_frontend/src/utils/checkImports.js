export const checkImports = (imports) => Object.keys(imports).filter((key) => !imports[key] || typeof imports[key] === 'undefined' || imports[key] === null);
/* Example usage
 
 const imports = {
   PersistGate,
   store,
   persistor,
 };
 
 const improperImports = verifyImports(imports);
 
 if (improperImports.length > 0) {
   console.log('Improper imports:');
   improperImports.forEach((importName) => console.log(`- ${importName}`));
 } else {
   console.log('All imports are proper.');
 }
*/

// import { checkImports } from "./utils/checkImports"

// const imports = {
//     PersistGate,
//     store,
//     persistor,
//   };
  
//   const improperImports = checkImports(imports);
  
//   if (improperImports.length > 0) {
//     console.log('Improper imports:');
//     improperImports.forEach((importName) => console.log(`- ${importName}`));
//   } else {
//     console.log('All imports are proper.');
//   }