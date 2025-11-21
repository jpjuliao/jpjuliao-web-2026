'use client';

type filesType = {
  files: string[];
}

export default function ContentNavClient({ files }: filesType) {
  console.log(files);
  return (
    <div>
      <h1>Contents</h1>
      <ul>
        {files.map((file) => (
          <li key={file}>{file}</li>
        ))}
      </ul>
    </div>
  )
}