/**
 * File Manager - Get File Icon
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import { JSX } from 'react';
import {
  IconFile,
  IconFileText,
  IconFileTypeDoc,
  IconFileTypeDocx,
  IconPhoto,
  IconFileSpreadsheet,
  IconFileTypePdf,
  IconFileTypeCsv,
  IconFileTypeSql,
  IconFileTypePpt,
} from '@tabler/icons-react';

export type FileExtension =
  | 'txt'
  | 'png'
  | 'jpg'
  | 'jpeg'
  | 'csv'
  | 'xls'
  | 'xlsx'
  | 'pdf'
  | 'doc'
  | 'sql'
  | 'ppt'
  | 'pptx'
  | 'docx';

export const getFileIcon = (
  extension: FileExtension,
  size = 24,
  color = 'gray',
): JSX.Element => {
  const icons = {
    txt: <IconFileText size={size} color={color} />,
    png: <IconPhoto size={size} color={color} />,
    jpg: <IconPhoto size={size} color={color} />,
    jpeg: <IconPhoto size={size} color={color} />,
    csv: <IconFileTypeCsv size={size} color={color} />,
    xls: <IconFileSpreadsheet size={size} color={color} />,
    xlsx: <IconFileSpreadsheet size={size} color={color} />,
    pdf: <IconFileTypePdf size={size} color={color} />,
    doc: <IconFileTypeDoc size={size} color={color} />,
    sql: <IconFileTypeSql size={size} color={color} />,
    ppt: <IconFileTypePpt size={size} color={color} />,
    pptx: <IconFileTypePpt size={size} color={color} />,
    docx: <IconFileTypeDocx size={size} color={color} />,
  };

  return icons[extension] || <IconFile size={size} color={color} />;
};
