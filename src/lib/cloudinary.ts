
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
    // Verificăm dacă putem accesa endpoint-ul de upload făcând un request OPTIONS
    // care ar trebui să returneze CORS headers dacă API-ul este disponibil și configurat corect
    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: 'OPTIONS',
    });
    
    // Pentru a verifica și configurarea upload preset-ului, facem o cerere de test minimală
    // care va eșua cu un mesaj specific dacă upload preset-ul nu există sau nu este configurat ca unsigned
    const testFormData = new FormData();
    testFormData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    // Adăugăm un blob mic de text în loc de o imagine pentru a minimiza transferul
    const smallBlob = new Blob(['test'], { type: 'text/plain' });
    testFormData.append('file', smallBlob, 'test.txt');
    
    const uploadResponse = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: 'POST',
      body: testFormData,
    });
    
    const result = await uploadResponse.json();
    
    if (result.error) {
      console.error('Cloudinary test upload failed:', result.error);
      // Verificăm dacă eroarea este din cauza unui preset invalid
      if (result.error.message.includes('Unknown API key') || 
          result.error.message.includes('Invalid upload preset') ||
          result.error.message.includes('not found')) {
        return false;
      }
    }
    
    // Dacă nu am primit o eroare despre upload preset sau am fost autorizați, 
    // înseamnă că API-ul este disponibil
    return response.ok || uploadResponse.ok || result.secure_url !== undefined;
  } catch (error) {
    console.error('Eroare la verificarea disponibilității Cloudinary:', error);
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

    // Facem cererea de upload cu verificarea erorilor
    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Eroare la încărcarea imaginii: ${errorData.error?.message || response.statusText}`);
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
