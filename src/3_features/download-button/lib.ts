import { API_HOST } from '@/shared/api';

export function getEventSourceData<T = any>(event: string = 'uploadready'): Promise<T> {
  const eventSource = new EventSource(`/api/events`);

  return new Promise<T>((resolve) => eventSource.addEventListener(event, (event) => {
    eventSource.close();
    resolve(JSON.parse(event.data) as T);
  }));
}

export function downloadFile(filePath: string) {
  const filename = filePath.split('/').pop() as string;
  return fetch('/api/download?url=' + encodeURIComponent(`${API_HOST}/${filePath}`))
    .then(res => res.blob())
    .then(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });
}