import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getFiles } from './get-files';
import fs from 'fs';
import path from 'path';

vi.mock('fs');
// We don't necessarily need to mock path if we are running on the same OS, 
// but for consistent testing of logic it can be safer. 
// However, getFiles uses path.join and path.relative which are pure functions mostly.
// Let's just mock fs for now and let path be real, or mock it if needed for path separators.

describe('getFiles', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return an empty array if the directory is empty', () => {
    vi.mocked(fs.readdirSync).mockReturnValue([]);
    const result = getFiles('/test/base');
    expect(result).toEqual([]);
  });

  it('should return a list of files and directories', () => {
    // Mock readdirSync to return a file and a directory
    vi.mocked(fs.readdirSync).mockImplementation((dir: string) => {
      if (dir === '/test/base') return ['file.txt', 'sub-dir'] as any;
      return [] as any;
    });

    // Mock statSync to return appropriate stats
    vi.mocked(fs.statSync).mockImplementation((filePath: string) => {
      const p = filePath.toString();
      if (p.endsWith('file.txt')) {
        return {
          isDirectory: () => false,
          isFile: () => true,
        } as any;
      }
      if (p.endsWith('sub-dir')) {
        return {
          isDirectory: () => true,
          isFile: () => false,
        } as any;
      }
      throw new Error(`Unexpected path: ${filePath}`);
    });

    const result = getFiles('/test/base');

    expect(result).toHaveLength(2);
    expect(result).toContainEqual({
      name: 'file.txt',
      path: 'file.txt', // path.relative('/test/base', '/test/base/file.txt')
      kind: 'file',
    });
    expect(result).toContainEqual({
      name: 'sub-dir',
      path: 'sub-dir',
      kind: 'directory',
    });
  });

  it('should recurse into directories when depth > 0', () => {
    vi.mocked(fs.readdirSync).mockImplementation((dir: string) => {
      if (dir === '/test/base') return ['root-file.txt', 'nested-dir'] as any;
      if (dir.toString().endsWith('nested-dir')) return ['nested-file.txt'] as any;
      return [] as any;
    });

    vi.mocked(fs.statSync).mockImplementation((filePath: string) => {
      const p = filePath.toString();
      if (p.endsWith('root-file.txt') || p.endsWith('nested-file.txt')) {
        return { isDirectory: () => false, isFile: () => true } as any;
      }
      if (p.endsWith('nested-dir')) {
        return { isDirectory: () => true, isFile: () => false } as any;
      }
      throw new Error(`Unexpected path: ${filePath}`);
    });

    const result = getFiles('/test/base', 1);

    const nestedDir = result.find((n) => n.name === 'nested-dir');
    expect(nestedDir).toBeDefined();
    expect(nestedDir?.kind).toBe('directory');
    expect(nestedDir?.children).toBeDefined();
    expect(nestedDir?.children).toHaveLength(1);
    expect(nestedDir?.children?.[0]).toEqual({
      name: 'nested-file.txt',
      path: path.join('nested-dir', 'nested-file.txt'),
      kind: 'file',
    });
  });

  it('should not recurse when depth is 0', () => {
    vi.mocked(fs.readdirSync).mockImplementation((dir: string) => {
      if (dir === '/test/base') return ['root-file.txt', 'nested-dir'] as any;
      return [] as any;
    });

    vi.mocked(fs.statSync).mockImplementation((filePath: string) => {
      const p = filePath.toString();
      if (p.endsWith('root-file.txt')) {
        return { isDirectory: () => false, isFile: () => true } as any;
      }
      if (p.endsWith('nested-dir')) {
        return { isDirectory: () => true, isFile: () => false } as any;
      }
      throw new Error(`Unexpected path: ${filePath}`);
    });

    const result = getFiles('/test/base', 0);

    const nestedDir = result.find((n) => n.name === 'nested-dir');
    expect(nestedDir).toBeDefined();
    expect(nestedDir?.children).toBeUndefined();
  });
});
