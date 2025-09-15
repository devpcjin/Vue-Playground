import { ref } from 'vue';

export const useImageUpload = () => {
  const isUploading = ref(false);
  const uploadError = ref<string | null>(null);

  const uploadImage = async (blob: Blob): Promise<string> => {
    isUploading.value = true;
    uploadError.value = null;

    try {
      // 실제 프로젝트에서는 서버에 업로드하는 로직을 구현하세요
      // 여기서는 예시로 base64 URL을 생성합니다
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      uploadError.value = '이미지 업로드에 실패했습니다.';
      throw error;
    } finally {
      isUploading.value = false;
    }
  };

  return {
    isUploading,
    uploadError,
    uploadImage,
  };
};
