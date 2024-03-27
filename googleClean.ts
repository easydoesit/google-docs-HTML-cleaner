import fs from 'fs';
import path from 'path';



export default function googleStrip(postTitle:string, sourceDirectory:string){
  const fullPath = path.join(sourceDirectory , postTitle + ".html");

  function cleanUpHTMLTags(htmlstring:string) {
    const segments = htmlstring.split(/(<[^>]*>)/);
    console.log(segments);

    for (let i = 0; i< segments.length; i++) {
      if (segments[i].startsWith('<') && segments[i].endsWith('>')) {
        segments[i] = segments[i].replace('\n', '');
        segments[i] = segments[i].replace(/<(\w+)(\s+class="[^"]*")?(\s+id="[^"]*")?(\s+start="\d+")?\s*>/g, "<$1>");
        segments[i] = segments[i].replaceAll(' ', '');
      } else {
        segments[i] = segments[i].replaceAll(/\n\s+/g, ' ');
        segments[i] = segments[i].replace('\n', '');
      }
    }
    console.log(segments);
    return segments.join('');
  
  }
  
  try {
    let fileContents = fs.readFileSync(fullPath, 'utf-8');

    // first remove all the head info
    const head = fileContents.substring (fileContents.indexOf("<html>"), fileContents.indexOf("</head>") + 7);
    fileContents = fileContents.replace(head, '');
    //then remove unrequired tags
    fileContents = fileContents.replace("</html>", "");
    fileContents = fileContents.replace('<body class="c3 doc-content">', "");
    fileContents = fileContents.replace("</body>", "");

    fileContents = cleanUpHTMLTags(fileContents);

    fileContents = fileContents.replaceAll("<span>", "");
    fileContents = fileContents.replaceAll("</span>", "");
    fileContents = fileContents.replaceAll('<p></p> ', "");

    //make it easier to read
    fileContents = fileContents.replaceAll('<p> ', "<p>\n");
    fileContents = fileContents.replaceAll(' </p>', "</p>");
    fileContents = fileContents.replaceAll('</p>', "</p>\n\n");
    fileContents = fileContents.replaceAll('\n</p>', "</p>");
    fileContents = fileContents.replaceAll('</p>', "\n</p>");
    fileContents = fileContents.replaceAll(' <p>', "<p>");

    fileContents = fileContents.replaceAll("</h1>", '</h1>\n\n');
    fileContents = fileContents.replaceAll("</li>", '</li>\n');
    fileContents = fileContents.replaceAll("<ol>", '<ol>\n');
    fileContents = fileContents.replaceAll("</ol>", '</ol>\n\n');
    fileContents = fileContents.replaceAll("<ul>", '<ul>\n');
    fileContents = fileContents.replaceAll("</ul>", '</ul>\n\n');

    return fileContents;

  } catch (error) {
  
    return false;
  
  }
   



}