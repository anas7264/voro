const fs = require('fs');
const path = require('path');

console.log('=========================================');
console.log('🧪 VERIFYING FORM PRIMITIVE HELPERS & A11Y');
console.log('=========================================');

const componentsDir = path.join(__dirname, 'src', 'components');

// 1. Check Input.jsx
const inputCode = fs.readFileSync(path.join(componentsDir, 'Input.jsx'), 'utf8');
if (!inputCode.includes('helperText') || !inputCode.includes('helperId') || !inputCode.includes('describedBy')) {
  console.error('❌ Input.jsx missing helperText or describedBy handling!');
  process.exit(1);
}
console.log('✅ Input.jsx helperText & aria-describedby verified.');

// 2. Check Select.jsx
const selectCode = fs.readFileSync(path.join(componentsDir, 'Select.jsx'), 'utf8');
if (!selectCode.includes('helperText') || !selectCode.includes('helperId') || !selectCode.includes('describedBy')) {
  console.error('❌ Select.jsx missing helperText or describedBy handling!');
  process.exit(1);
}
console.log('✅ Select.jsx helperText & aria-describedby verified.');

// 3. Check Textarea.jsx
const textareaCode = fs.readFileSync(path.join(componentsDir, 'Textarea.jsx'), 'utf8');
if (!textareaCode.includes('helperText') || !textareaCode.includes('helperId') || !textareaCode.includes('describedBy')) {
  console.error('❌ Textarea.jsx missing helperText or describedBy handling!');
  process.exit(1);
}
console.log('✅ Textarea.jsx helperText & aria-describedby verified.');

// 4. Check Checkbox.jsx
const checkboxCode = fs.readFileSync(path.join(componentsDir, 'Checkbox.jsx'), 'utf8');
if (!checkboxCode.includes('descId') || !checkboxCode.includes('describedBy')) {
  console.error('❌ Checkbox.jsx missing descId or describedBy handling!');
  process.exit(1);
}
console.log('✅ Checkbox.jsx description & aria-describedby verified.');

// 5. Check Form wrappers
const formInputCode = fs.readFileSync(path.join(componentsDir, 'FormInput.jsx'), 'utf8');
const formSelectCode = fs.readFileSync(path.join(componentsDir, 'FormSelect.jsx'), 'utf8');
const formTextareaCode = fs.readFileSync(path.join(componentsDir, 'FormTextarea.jsx'), 'utf8');

if (!formInputCode.includes('helperText={helperText}')) {
  console.error('❌ FormInput.jsx missing helperText forwarding!');
  process.exit(1);
}
if (!formSelectCode.includes('helperText={helperText}')) {
  console.error('❌ FormSelect.jsx missing helperText forwarding!');
  process.exit(1);
}
if (!formTextareaCode.includes('helperText={helperText}')) {
  console.error('❌ FormTextarea.jsx missing helperText forwarding!');
  process.exit(1);
}
console.log('✅ FormInput, FormSelect, FormTextarea helperText forwarding verified.');

console.log('\n🎉 ALL FORM PRIMITIVE HELPER & A11Y VERIFICATION TESTS PASSED SUCCESSFULLY!');
console.log('=========================================');
