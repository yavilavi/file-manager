/**
 * File Manager - Fetcheditorconfig
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import apiCall from '../axios';
import {EditorConfigInterface} from "../../types/interfaces/editor-configInterface.ts";

export const fetchEditorConfig = async (fileId: number): Promise<EditorConfigInterface> => {
    const {data} = await apiCall.get(`/files/${fileId}/editor-url`);
    return data;
};
