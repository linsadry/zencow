/* utils/image.js
 * Exporta compressImage para uso em todos os screens do ZenCow
 */

export async function compressImage(file, maxW = 1024, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Erro ao ler arquivo"));
    reader.onload  = e => {
      const img = new Image();
      img.onerror = () => reject(new Error("Erro ao carregar imagem"));
      img.onload  = () => {
        let w = img.width, h = img.height;
        if (w > maxW || h > maxW) {
          if (w >= h) { h = Math.round(h * maxW / w); w = maxW; }
          else        { w = Math.round(w * maxW / h); h = maxW; }
        }
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}
