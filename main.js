#!/usr/bin/node

// DEPENDENCIES

const fs = require('fs');
const URL = require('url');


// DEFINE FUNCTIONS
const print = (...input) => console.log('>>', ...input, '\n');
const pDiv = (divider = '-', num = 5) => console.log(divider.repeat(num), '\n');

const templateRegex = {
  tags: {
    component: /<!--%[-\w\s="'\/.]*\/%-->/g,
    execution: /<!--%=[-\w\s="'\/.]*\/%-->/g,
  },
  inline: {
    execution: /{%\s*[\w\d\s\-\\/|!@#$%^&*()+=?.,<>;:"']*\s*\/%}/gi,
  },
};

let currentPage = '';

const renderComponent = (filePath, component, outputData) => {

  const tString = component[0];
  print('template string:', tString);

  const componentPath = tString.split('%')[1].replace(/\s*\/$/, '').trim();
  print('getting component\'s path:', `"${componentPath}"`);

  print("reading component data...");
  const componentData = fs.readFileSync(`${filePath}/${componentPath}`, 'utf-8');

  print(`${componentData.split(/\n/g).slice(0,3).join('\n')}...`);

  print('replacing template string with component data...');
  pDiv();

  return outputData.replace(component, componentData);
}

const executeCode = (codeString, outputData) => {

  print('codeString[0]:', codeString[0]);

  const codeFunc = codeString[0].replace(/({%\s*)|(\s*\/%})/gi, '');

  print('codeFunc', codeFunc);

  const output = eval(codeFunc);

  print('output:', '\n', '```\n', output, '\n```');

  pDiv('*');

  return outputData.replace(codeString, output);
}

const getFileData = filePath => fs.readFileSync(filePath, 'utf-8');

const findTemplate = (templateType, data) => Array.from(data.matchAll(templateType));

const findTemplateComponents = (data) => findTemplate(templateRegex.tags.component, data);

const findTemplateTagExecution = (data) => findTemplate(templateRegex.tags.execution, data);

const findTemplateInlineExecution = (data) => findTemplate(templateRegex.inline.execution, data);

const processFile = (inputFilePath, outputPath) => {

  print(`reading ${inputFilePath}...`)
  const currentFileData = getFileData(inputFilePath);

  const inputFileDir = inputFilePath.split('/').slice(0,-1).join('/');
  print('inputFileDir:', inputFileDir);

    // copy file data to outputData, so new component renderings don't overwrite old renderings
  let outputData = currentFileData;

  print('Finding templated components...')
  const components = findTemplateComponents(currentFileData);

  if (components.length > 0) {
    print('...found some template strings!');
    components.forEach(component => {
      print(`...rendering component:\n${component[0]}\n...`);

      outputData = renderComponent(inputFileDir, component, outputData);
    });
  }

  print('...finding code to execute...')
  const tagExecutions = Array.from(findTemplateTagExecution(outputData));
  const inlineExecutions = Array.from(findTemplateInlineExecution(outputData));
  const allExecutions = [...tagExecutions, ...inlineExecutions];

  if (allExecutions.length > 0) {
    print('...found some code to execute!');
    allExecutions.forEach(codeString => {
      print(`...executing code\n${codeString}...`);
      outputData = executeCode(codeString, outputData);
    });
  }

  print(`outputting to ${outputPath}`)
  fs.writeFileSync(outputPath, outputData, 'utf-8');
};

const [_, __, inputPath = './', outputPath = './'] = args = process.argv;

// START OF CODE
try {
  print(`processing "${inputPath}"...`);

  print(`is input "${inputPath}" a File or Directory?`);
  const inputIsDirectory = fs.lstatSync(inputPath).isDirectory();

  if (inputIsDirectory) {
    print(`input "${inputPath}" is a directory`)
    const validDirContents = fs.readdirSync(inputPath).filter(file => file.match(/[\w-.]*\.tmplt/g));

    print('found tmplt files: ', validDirContents);

    validDirContents.forEach(currentFile => {
      pDiv('=== ', 3);
      print(`at ${currentFile}`);
      currentPage = currentFile;

      pDiv('*', 40);
      print('currentPage =', currentPage);
      pDiv('*',40);

      const newInputPath = URL.pathToFileURL(`${inputPath}${currentFile}`).pathname;

      const newFileName = `${currentFile.split('.')[0]}.html`

      const newOutput = `${outputPath}${newFileName}`;

      processFile(newInputPath, newOutput);

    });

  } else {

    print(`input "${inputPath}" is a file`)

    currentPage = inputPath.split('/').pop();
    pDiv('*', 40);
    print('currentPage:', currentPage);
    pDiv('*', 40);

    const path = inputPath.replace(/[\w\d-]+\.\w+\.\w*/, '');

    const encodedPath = URL.pathToFileURL(path);
    print('encodedPath.pathname', encodedPath.pathname);

    processFile(inputPath, outputPath);

  };

} catch (err) {
  console.error(err.message);
}

