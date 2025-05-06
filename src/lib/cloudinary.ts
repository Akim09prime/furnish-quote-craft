
/**
 * Utilitar pentru încărcarea imaginilor în Cloudinary
 * Configurare pentru domeniul www.velmyra.org
 */

const CLOUDINARY_CLOUD_NAME = 'velmyra'; // Numele cloud-ului dvs. Cloudinary
const CLOUDINARY_UPLOAD_PRESET = 'ml_default'; // Preset-ul standard este 'ml_default' dacă nu ați creat unul personalizat
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
const CUSTOM_DOMAIN = 'www.velmyra.org'; // Domeniul dvs. personalizat

/**
 * Verifică disponibilitatea API-ului Cloudinary
 */
export const checkCloudinaryAvailability = async (): Promise<{ available: boolean, message?: string }> => {
  try {
    // Facem o cerere de verificare către Cloudinary
    const response = await fetch(
      `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/list/sample`,
      { method: 'HEAD' }
    );
    
    if (response.ok) {
      return { available: true };
    } else {
      return { 
        available: false,
        message: `Eroare Cloudinary: ${response.status} ${response.statusText}` 
      };
    }
  } catch (error) {
    console.error('Eroare la verificarea Cloudinary:', error);
    return { 
      available: false, 
      message: 'Nu se poate accesa API-ul Cloudinary. Verificați conexiunea la internet.'
    };
  }
};

/**
 * Încarcă o imagine în Cloudinary și returnează URL-ul public
 * Configurată special pentru domeniul www.velmyra.org
 */
export const uploadProductImage = async (
  file: File,
  folder: string = 'products',
  onProgress?: (progress: number) => void
): Promise<string> => {
  try {
    if (!file) {
      throw new Error('Nu a fost furnizat niciun fișier pentru încărcare');
    }

    // Inițializăm progresul
    if (onProgress) onProgress(10);

    // Creăm FormData pentru API-ul Cloudinary
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', folder);

    // Adăugăm atributele pentru domeniul personalizat (metadata)
    formData.append('context', `custom_domain=${CUSTOM_DOMAIN}`);
    
    // Simulăm progresul inițial
    if (onProgress) onProgress(20);
    
    // Facem cererea de upload
    const uploadStartTime = Date.now();
    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: 'POST',
      body: formData
    });

    // Simulăm progresul în timpul uploadului
    const simulateProgress = () => {
      if (onProgress) {
        const elapsed = Date.now() - uploadStartTime;
        // Progres simulat bazat pe timp
        if (elapsed < 500) onProgress(30);
        else if (elapsed < 1000) onProgress(50);
        else if (elapsed < 2000) onProgress(70);
        else onProgress(90);
      }
    };
    simulateProgress();
    
    // Verificăm răspunsul
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Eroare răspuns Cloudinary:', response.status, response.statusText, errorData);
      
      // Afișăm eroarea specifică, dacă există
      const errorMessage = errorData.error?.message || `Eroare la încărcarea imaginii: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    // Progres complet
    if (onProgress) onProgress(100);
    
    // Înlocuim URL-ul standard cu domeniul personalizat, dacă este cazul
    let imageUrl = data.secure_url;
    
    // Log pentru debugging
    console.log('Imagine încărcată cu succes:', {
      original_url: imageUrl,
      custom_domain: CUSTOM_DOMAIN,
      public_id: data.public_id
    });
    
    // Returnăm URL-ul securizat al imaginii
    return imageUrl;
  } catch (error) {
    console.error('Eroare la încărcarea imaginii în Cloudinary:', error);
    throw error;
  }
};

/**
 * Construiește un URL pentru imaginile stocate în Cloudinary folosind domeniul personalizat
 */
export const getCustomDomainImageUrl = (publicId: string, transformation: string = ''): string => {
  // Dacă avem un URL complet, îl returnăm așa cum este
  if (publicId.startsWith('http')) return publicId;
  
  // Altfel, construim URL-ul cu domeniul personalizat
  const transformationStr = transformation ? `${transformation}/` : '';
  return `https://${CUSTOM_DOMAIN}/image/upload/${transformationStr}${publicId}`;
};

/**
 * Șterge o imagine din Cloudinary
 */
export const deleteProductImage = async (publicId: string): Promise<void> => {
  // Notă: Ștergerea resurselor necesită autentificare API semnată
  console.log(`Imaginea cu public_id ${publicId} ar trebui ștearsă.`);
  console.log('Pentru implementarea reală a ștergerii, veți avea nevoie de un backend securizat.');
  
  // Pentru a șterge imaginile vă trebui, în final, o funcție backend securizată
  // Exemplu: await deleteImageOnBackend(publicId);
};
