
/**
 * Utilitar pentru încărcarea imaginilor în Cloudinary
 */

const CLOUDINARY_CLOUD_NAME = 'velmyra';
const CLOUDINARY_UPLOAD_PRESET = 'default_upload';
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

/**
 * Verifică disponibilitatea API-ului Cloudinary
 */
export const checkCloudinaryAvailability = async (): Promise<boolean> => {
  try {
    // În loc să folosim endpoint-ul /ping care poate fi blocat de CORS,
    // vom folosi o abordare alternativă verificând dacă putem accesa
    // resurse publice de la Cloudinary
    const response = await fetch(
      `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/v1/sample.jpg`,
      { method: 'HEAD', mode: 'no-cors' }
    );
    
    // Dacă ajungem aici, înseamnă că serverul Cloudinary este accesibil
    // response.ok va fi undefined din cauza no-cors, dar abordăm asta
    return true;
  } catch (error) {
    console.error('Eroare la verificarea Cloudinary:', error);
    return false;
  }
};

/**
 * Încarcă o imagine în Cloudinary și returnează URL-ul public
 */
export const uploadProductImage = async (
  file: File,
  folder?: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  try {
    // Simulează progresul pentru interfață
    if (onProgress) {
      const progressInterval = setInterval(() => {
        const randomProgress = Math.floor(Math.random() * 30) + 10; // între 10-40%
        onProgress(randomProgress);
      }, 500);

      // După 1.5 secunde simulăm un progres de 70%
      setTimeout(() => {
        if (onProgress) onProgress(70);
      }, 1500);

      // Cleanup interval după încărcare
      setTimeout(() => clearInterval(progressInterval), 3000);
    }

    // Creăm FormData pentru API-ul Cloudinary
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    // Adăugăm folder dacă este specificat
    if (folder) {
      formData.append('folder', folder);
    }

    // Facem cererea de upload
    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Eroare la încărcarea imaginii: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Simulăm progres complet
    if (onProgress) {
      onProgress(100);
    }

    // Returnăm URL-ul securizat al imaginii încărcate
    return data.secure_url;
  } catch (error) {
    console.error('Eroare la încărcarea imaginii în Cloudinary:', error);
    throw error;
  }
};

/**
 * Șterge o imagine din Cloudinary (această funcție este un placeholder,
 * deoarece ștergerea necesită autentificare semnată, deci vom folosi doar un log)
 */
export const deleteProductImage = async (publicId: string): Promise<void> => {
  console.log(`Imaginea cu public_id ${publicId} ar trebui ștearsă.`);
  console.log('Notă: Ștergerea resurselor necesită autentificare API semnată cu o cheie secretă.');
  // Pentru implementarea reală a ștergerii, vezi documentația Cloudinary:
  // https://cloudinary.com/documentation/admin_api#delete_resources
};
