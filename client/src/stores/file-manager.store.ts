/**
 * File Manager - File Manager.Store
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import { create } from 'zustand';
import { FileInterface } from '../types/interfaces/file.interface.ts';

interface FileManagerState {
  selectedFile: FileInterface | null;
  setSelectedFile: (file: FileInterface | null) => void;
  clearSelectedFile: () => void;
}

const useFileManagerStore = create<FileManagerState>()((set) => ({
  selectedFile: null,
  setSelectedFile: (file: FileInterface | null) => set({ selectedFile: file }),
  clearSelectedFile: () => set({ selectedFile: null }),
}));

export default useFileManagerStore;
