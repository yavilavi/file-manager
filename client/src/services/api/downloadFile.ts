import apiCall from '../axios.ts';


export const downloadFile = async (fileId: number) => {
  const response = await apiCall.get(`/files/${fileId}/download`, {
    responseType: 'blob',
  });

  const contentDisposition = response.headers['content-disposition'];
  const fileNameMatch = contentDisposition?.match(/filename="(.+)"/);
  console.log(fileNameMatch);
  console.log(contentDisposition);
  console.log(response);
  const fileName = fileNameMatch?.[1] || 'archivo.bin';

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();

  return true;
};
