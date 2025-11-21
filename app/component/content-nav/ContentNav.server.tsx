import path from 'path';
import fs from 'fs';
import ContentNavClient from './ContentNav.client';

export default function ContentNavServer() {
  const contentDir = path.join(process.cwd(), 'content');

  let files: string[] = [];
  const getFiles = (folder: string) => {
    console.log(folder);
    fs.readdirSync(folder).forEach((file) => {
      const filePath = path.join(folder, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        const folderName = path.basename(filePath);
        files.push(folderName);
        // getFiles(filePath);
      } else {
        files.push(path.basename(filePath));
      }
    });
  }

  getFiles(contentDir);

  return (
    <div>
      <ContentNavClient files={files} />
    </div>
  )
}
