export const compressImage = (file, maxW=1024, quality=0.85) => new Promise(res => {
  const r = new FileReader();
  r.onload = e => {
    const img = new Image();
    img.onload = () => {
      const scale  = Math.min(1, maxW / img.width);
      const canvas = document.createElement("canvas");
      canvas.width  = img.width  * scale;
      canvas.height = img.height * scale;
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      res(canvas.toDataURL("image/jpeg", quality));
    };
    img.src = e.target.result;
  };
  r.readAsDataURL(file);
});
