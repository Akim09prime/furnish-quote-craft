
/**
 * Utilitar pentru încărcarea imaginilor în Cloudinary
 */

// Configurație Cloudinary
const CLOUDINARY_CLOUD_NAME = 'demo'; // Modificat de la 'velmyra' la 'demo' (cloud name de test oficial Cloudinary)
const CLOUDINARY_UPLOAD_PRESET = 'ml_default'; // Modificat la preset-ul implicit pentru contul demo
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

/**
 * Verifică disponibilitatea API-ului Cloudinary
 */
export const checkCloudinaryAvailability = async (): Promise<boolean> => {
  try {
    console.log(`Verificare Cloudinary API cu: ${CLOUDINARY_CLOUD_NAME} și preset: ${CLOUDINARY_UPLOAD_PRESET}`);
    
    // Verificăm dacă putem accesa endpoint-ul de upload făcând un request OPTIONS
    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: 'OPTIONS',
    });
    
    // Test upload minim pentru a verifica și preset-ul
    const testFormData = new FormData();
    testFormData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    const smallBlob = new Blob(['test'], { type: 'text/plain' });
    testFormData.append('file', smallBlob, 'test.txt');
    
    const uploadResponse = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: 'POST',
      body: testFormData,
    });
    
    const result = await uploadResponse.json();
    
    if (result.error) {
      console.error('Cloudinary test upload failed:', result.error);
      return false;
    }
    
    // Dacă avem un URL securizat, înseamnă că upload-ul a funcționat
    return result.secure_url !== undefined;
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
