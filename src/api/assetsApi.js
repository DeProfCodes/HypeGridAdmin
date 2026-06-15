import { httpClient } from '@/api/http/httpClient';
import { unwrapResult } from '@/api/http/unwrapResult';

// Admin image-upload client. Posts multipart/form-data to the backend, which
// stores the file in Cloudflare R2 and returns the public URL + metadata
// ({ url, key, file_name, content_type, size_bytes, recommended_* }).
export const assetsApi = {
  async upload(file, category) {
    const form = new FormData();
    form.append('file', file);
    form.append('category', category);
    // Let axios/browser set the multipart boundary; just flag the type.
    return unwrapResult(
      await httpClient.post('/api/admin/assets/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000,
      }),
    );
  },
};
